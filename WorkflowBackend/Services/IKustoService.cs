using System.Data;

namespace WorkflowBackend.Services
{
    public interface IKustoService
    {
        public Task<DataTable> ExecuteQueryAsync(string cluster, string database, string query, string operationName, DateTime? startTime, DateTime? endTime, int timeoutSeconds = KustoService.DefaultQueryTimeoutInSeconds);
    }
}