namespace WorkflowBackend.Controllers
{
    public class KustoCallBody
    {
        public string? StartTime { get; set; }
        public string? ClusterName { get; set; }
        public string? DatabaseName { get; set; }
        public string? QueryText { get; set; }
        public string? OperationName { get; set; } 
        public string? EndTime { get; set; }
        public List<StepVariable>? Variables { get; set; }
    }
}