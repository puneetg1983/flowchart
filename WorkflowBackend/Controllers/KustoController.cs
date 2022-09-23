using Kusto.Data.Exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using WorkflowBackend.Models;
using WorkflowBackend.Services;

namespace WorkflowBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KustoController : ControllerBase
    {
        private const int MaxKustoRowsAllowed = 10;
        private const int MaxKustoColumnsAllowed = 10;
        private readonly IKustoService _kustoService;

        public KustoController(IKustoService kustoService)
        {
            _kustoService = kustoService;
        }

        [HttpPost("execute")]
        [HttpOptions("execute")]
        public async Task<IActionResult> Execute([FromBody] KustoCallBody body)
        {
            if (string.IsNullOrEmpty(body.QueryText))
            {
                return BadRequest("QueryText is null or empty");
            }

            GetDateTimes(body.StartTime, body.EndTime, out DateTime startDateTime, out DateTime endDateTime);
            string queryText = ParseVariables(body.QueryText, body.Variables);
            if (queryText.Contains("{{") || queryText.Contains("}}"))
            {
                return BadRequest("Query is contain some variables that we couldn't parse. Please check the query text");
            }

            try
            {
                var result = await _kustoService.ExecuteQueryAsync(
                body.ClusterName ?? "wawseas",
                body.DatabaseName ?? "wawsprod",
                queryText,
                body.OperationName ?? "TestOperation",
                startDateTime,
                endDateTime);

                if (result == null)
                {
                    return Ok();
                }

                if (result.Rows.Count > MaxKustoRowsAllowed
                    || result.Columns.Count > MaxKustoColumnsAllowed)
                {
                    return BadRequest($"Workflow nodes are not data dumps so you shouldn't be writing queries that are returning more than {MaxKustoRowsAllowed} rows of data and {MaxKustoColumnsAllowed} number of columns. Please optimize your query accordingly.");
                }

                return Ok(result.ToDataTableResponseObject());
            }
            catch (SemanticException kustoEx)
            {
                return BadRequest(kustoEx.SemanticErrors);
            }
            catch (KustoClientException kustoClientEx)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, kustoClientEx.Message);
            }
            catch (InvalidDataException invalidData)
            {
                return BadRequest(invalidData.Message);
            }
            catch (Exception)
            {
                throw;
            }

        }

        private string ParseVariables(string queryText, List<StepVariable>? variables)
        {
            if (variables == null || variables.Count == 0)
            {
                return queryText;
            }

            foreach (var variable in variables)
            {
                string expression = "{{" + variable.name + "}}";
                queryText = queryText.Replace(expression, variable.runtimeValue);
            }

            return queryText;
        }

        private static void GetDateTimes(string? startTime, string? endTime, out DateTime startDateTime, out DateTime endDateTime)
        {
            startDateTime = DateTime.UtcNow.AddHours(-2);
            endDateTime = DateTime.UtcNow.AddHours(-1);
            if (DateTime.TryParse(startTime, out DateTime stTime))
            {
                startDateTime = stTime;
            }

            if (DateTime.TryParse(endTime, out DateTime etTime))
            {
                endDateTime = etTime;
            }
        }
    }
}
