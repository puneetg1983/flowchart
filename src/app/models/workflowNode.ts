export class workflow {
  root: workflowNode;
}
export class workflowNode {
  id: string;
  type: string;
  data: workflowNodeData;
  children: workflowNode[];
}

export class workflowNodeData {
  name: string = '';
  detectorId: string = '';
  isEditing: boolean = false;
  queryText: string = '';
  queryTextTemp: string = '';
  isEditingQuery: boolean = false;
  completionOptions: string[] = [];
  conditionValue:string;
}
