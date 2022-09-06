namespace WorkflowBackend.Models
{
    public class DataTableResponseObject
    {
        public string TableName { get; set; }

        public IEnumerable<DataTableResponseColumn> Columns { get; set; }

        public dynamic[][] Rows { get; set; }
    }
}
