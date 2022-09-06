using Kusto.Cloud.Platform.Utils;
using Kusto.Data.Exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WorkflowBackend.Services;

namespace WorkflowBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KustoController : ControllerBase
    {
        private readonly IKustoService _kustoService;

        public KustoController(IKustoService kustoService)
        {
            _kustoService = kustoService;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string clusterName, string databaseName, string queryText, string? operationName, string? startTime, string? endTime)
        {
            GetDateTimes(startTime, out DateTime startDateTime, out DateTime endDateTime);
            var result = await _kustoService.ExecuteQueryAsync(
                clusterName,
                databaseName,
                queryText,
                operationName ?? "TestOperation",
                startDateTime,
                endDateTime);

            return Ok(result.Rows[0][0]);
        }

        private static void GetDateTimes(string? startTime, out DateTime startDateTime, out DateTime endDateTime)
        {
            startDateTime = DateTime.UtcNow.AddHours(-2);
            endDateTime = DateTime.UtcNow.AddHours(-2);
            if (DateTime.TryParse(startTime, out DateTime stTime))
            {
                startDateTime = stTime;
            }

            if (DateTime.TryParse(startTime, out DateTime etTime))
            {
                endDateTime = etTime;
            }
        }
    }
}
