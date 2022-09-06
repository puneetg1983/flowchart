using Kusto.Data.Exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WorkflowBackend.Models;
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

        [HttpPost("execute")]
        [HttpOptions("execute")]
        public async Task<IActionResult> Execute([FromBody] KustoCallBody body)
        {
            GetDateTimes(body.StartTime, body.EndTime, out DateTime startDateTime, out DateTime endDateTime);
            var result = await _kustoService.ExecuteQueryAsync(
                body.ClusterName,
                body.DatabaseName,
                body.QueryText,
                body.OperationName,
                startDateTime,
                endDateTime);

            if (result == null)
            {
                return Ok();
            }

            return Ok(result.ToDataTableResponseObject());
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
