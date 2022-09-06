namespace WorkflowBackend.Controllers
{
    public class KustoCallBody
    {
        public string? StartTime { get; set; }
        public string ClusterName { get; set; } = "wawswus";
        public string DatabaseName { get; set; } = "wawsprod";
        public string QueryText { get; set; } = "";
        public string OperationName { get; set; } = "TestOperation";
        public string? EndTime { get; set; }
    }
}