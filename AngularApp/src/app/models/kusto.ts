import { DataTableResponseColumn } from "src/services/KustoService";
import { stepVariable } from "./workflowNode";

export class kustoQueryDialogParams {
  queryLabel: string;
  queryText: string;
  variables: stepVariable[];
  kustoQueryColumns: DataTableResponseColumn[];
  completionOptions: stepVariable[] = [];
}