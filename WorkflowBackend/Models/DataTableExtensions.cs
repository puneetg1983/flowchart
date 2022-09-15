using Kusto.Cloud.Platform.Utils;
using System.Data;

namespace WorkflowBackend.Models
{
    public static class DataTableExtensions
    {
        public static DataTable ToDataTable(this DataTableResponseObject dataTableResponse)
        {
            if (dataTableResponse == null)
            {
                throw new ArgumentNullException("dataTableResponse");
            }

            var dataTable = new DataTable(dataTableResponse.TableName);

            dataTable.Columns.AddRange(dataTableResponse.Columns.Select(column => new DataColumn(column.ColumnName, GetColumnType(column.DataType))).ToArray());

            for (int i = 0; i < dataTableResponse.Rows.GetLength(0); i++)
            {
                var row = dataTable.NewRow();
                for (int j = 0; j < dataTable.Columns.Count; j++)
                {
                    row[j] = dataTableResponse.Rows[i][j] ?? DBNull.Value;
                }

                dataTable.Rows.Add(row);
            }

            return dataTable;
        }

        public static DataTableResponseObject ToDataTableResponseObject(this DataTable table)
        {
            var dataTableResponseObject = new DataTableResponseObject
            {
                TableName = table.TableName
            };

            var columns = new List<DataTableResponseColumn>();
            foreach (DataColumn col in table.Columns)
            {
                if (col.DataType.ToString() == "System.Object")
                {
                    throw new InvalidDataException($"Column '{col.ColumnName}' has a complex object type which is not currently supported");
                }

                columns.Add(new DataTableResponseColumn() { ColumnName = col.ColumnName, DataType = col.DataType.ToString().Replace("System.", "") });
            }

            var rows = new dynamic[table.Rows.Count][];

            for (int i = 0; i < table.Rows.Count; i++)
            {
                rows[i] = table.Rows[i].ItemArray;
            }

            dataTableResponseObject.Columns = columns;
            dataTableResponseObject.Rows = rows;

            return dataTableResponseObject;
        }

        internal static Type GetColumnType(string datatype)
        {
            if (datatype.Equals("int", StringComparison.OrdinalIgnoreCase))
            {
                datatype = "int32";
            }

            return Type.GetType($"System.{datatype}", false, true) ?? Type.GetType($"System.String");
        }
    }
}
