using Kusto.Cloud.Platform.Data;
using Kusto.Data;
using Kusto.Data.Common;
using System.Collections.Concurrent;
using System.Data;
using System.Text.RegularExpressions;

namespace WorkflowBackend.Services
{
    public class KustoService:IKustoService
    {
        internal const string MicrosoftTenantAuthorityId = "72f988bf-86f1-41af-91ab-2d7cd011db47";
        internal const int TokenRefreshIntervalInMs = 10 * 60 * 1000;   // 10 minutes
        internal const string DefaultKustoEndpoint = "https://wawswus.kusto.windows.net";
        internal const string KustoApiEndpointFormat = "https://{0}.kusto.windows.net:443/v1/rest/query";
        internal const string AADKustoResource = "https://wawswus.kusto.windows.net";
        internal const int DefaultQueryTimeoutInSeconds = 60;
        internal static readonly TimeSpan DefaultTimeGrain = TimeSpan.FromMinutes(5);

        private readonly IKustoAuthProvider authProvider;
        private readonly string aadKustoResource = string.Empty;
        private readonly string kustoApiQueryEndpoint = string.Empty;
        private readonly static ConcurrentDictionary<Tuple<string, string>, ICslQueryProvider> QueryProviderMapping = new();
        private readonly static ConcurrentDictionary<string, string> KustoClusterGeoMapping = new();

        public KustoService(IConfiguration configuration, IKustoAuthProvider kustoAuthProvider)
        {
            authProvider = kustoAuthProvider;
            aadKustoResource = $"{configuration["Kusto:AADKustoResource"]}";
            if (string.IsNullOrWhiteSpace(aadKustoResource))
            {
                aadKustoResource = AADKustoResource;
            }

            kustoApiQueryEndpoint = KustoApiEndpoint + ":443";
        }

        public async Task<DataTable> ExecuteQueryAsync(string cluster, string database, string query, string operationName, DateTime? startTime = null, DateTime? endTime = null, int timeoutSeconds = DefaultQueryTimeoutInSeconds)
        {
            if (string.IsNullOrWhiteSpace(cluster))
            {
                throw new ArgumentNullException(paramName: nameof(cluster), message: "Kusto cluster name against which the query must be executed cannot be null or empty.");
            }

            if (string.IsNullOrWhiteSpace(database))
            {
                throw new ArgumentNullException(paramName: nameof(database), message: "Kusto database name against which the query must be executed cannot be null or empty.");
            }

            if (string.IsNullOrWhiteSpace(query))
            {
                throw new ArgumentNullException(paramName: nameof(query), message: "Query text to execute cannot be null or empty.");
            }

            if (string.IsNullOrWhiteSpace(operationName))
            {
                throw new ArgumentNullException(paramName: nameof(operationName), message: "Please specify an operation name to idetify this query.");
            }

            DataSet dataSet;
            try
            {
                ClientRequestProperties clientRequestProperties = new ClientRequestProperties();
                var kustoClientId = $"Diagnostics.{operationName};WorkflowBackend;{startTime?.ToString() ?? "UnknownStartTime"};{endTime?.ToString() ?? "UnknownEndTime"}##{0}_{Guid.NewGuid().ToString()}";
                clientRequestProperties.ClientRequestId = kustoClientId;
                clientRequestProperties.SetOption("servertimeout", new TimeSpan(0, 0, timeoutSeconds));
                if (cluster.StartsWith("waws", StringComparison.OrdinalIgnoreCase) && cluster.EndsWith("follower", StringComparison.OrdinalIgnoreCase))
                {
                    clientRequestProperties.SetOption(ClientRequestProperties.OptionQueryConsistency, ClientRequestProperties.OptionQueryConsistency_Weak);
                }

                var kustoClient = Client(cluster, database);
                var result = await kustoClient.ExecuteQueryAsync(database, query, clientRequestProperties);
                dataSet = result.ToDataSet();
            }
            catch (Exception ex)
            {
                // TODO: Log exception details here.
                throw;
            }

            DataTable? datatable = dataSet?.Tables?[0];
            if (datatable == null)
            {
                datatable = new DataTable();
            }

            return datatable;
        }

        private string KustoApiEndpoint
        {
            get
            {
                var m = Regex.Match(aadKustoResource, @"https://(?<cluster>\w+).");
                if (m.Success)
                {
                    return aadKustoResource.Replace(m.Groups["cluster"].Value, "{cluster}");
                }
                else
                {
                    throw new ArgumentException(nameof(aadKustoResource) + " not correctly formatted.");
                }
            }
        }

        private string GetClientIdentifyingName()
        {
            return IsRunningLocal ? $"LocalMachine|{Environment.MachineName}" : $"{Environment.GetEnvironmentVariable("WEBSITE_HOSTNAME")}|{Environment.GetEnvironmentVariable("COMPUTERNAME") ?? Environment.MachineName}";
        }

        private static bool IsRunningLocal
        {
            get
            {
                return string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable("WEBSITE_HOSTNAME"));
            }
        }

        private ICslQueryProvider Client(string cluster, string database)
        {
            var key = Tuple.Create(cluster, database);
            if (!QueryProviderMapping.ContainsKey(key))
            {
                var connectionStringBuilder = new KustoConnectionStringBuilder(kustoApiQueryEndpoint.Replace("{cluster}", cluster), database)
                {
                    ApplicationNameForTracing = GetClientIdentifyingName()
                };
                if (authProvider.AuthDetails.AuthScheme == KustoAuthSchemes.UserAssignedManagedIdentity)
                {
                    connectionStringBuilder = connectionStringBuilder.WithAadUserManagedIdentity(authProvider.AuthDetails.ClientId);
                }
                else
                {
                    if (authProvider.AuthDetails.AuthScheme == KustoAuthSchemes.CertBasedToken)
                    {
                        connectionStringBuilder = connectionStringBuilder.WithAadApplicationSubjectAndIssuerAuthentication(
                            applicationClientId: authProvider.AuthDetails.ClientId,
                            applicationCertificateSubjectDistinguishedName: GenericCertLoader.Instance.GetCertBySubjectName(authProvider.AuthDetails.TokenRequestorCertSubjectName).Subject,
                            applicationCertificateIssuerDistinguishedName: GenericCertLoader.Instance.GetCertBySubjectName(authProvider.AuthDetails.TokenRequestorCertSubjectName).IssuerName.Name,
                            authority: authProvider.AuthDetails.TenantId);
                    }
                    else
                    {
                        if (authProvider.AuthDetails.AuthScheme == KustoAuthSchemes.AppKey)
                        {
                            connectionStringBuilder = connectionStringBuilder.WithAadApplicationKeyAuthentication(
                                applicationClientId: authProvider.AuthDetails.ClientId,
                                applicationKey: authProvider.AuthDetails.AppKey,
                                authority: authProvider.AuthDetails.TenantId);
                        }
                        else
                        {
                            throw new InvalidOperationException("Attempt to create kusto client with invalid configuration. At least one of the auth configuration (User assigned MSI, SN+I, AppKey) must be configured.");
                        }
                    }
                }

                var queryProvider = Kusto.Data.Net.Client.KustoClientFactory.CreateCslQueryProvider(connectionStringBuilder);
                if (!QueryProviderMapping.TryAdd(key, queryProvider))
                {
                    queryProvider.Dispose();
                }
            }

            return QueryProviderMapping[key];
        }
    }
}
