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
  name: string;
  inputs: workflowInputs[];
}

export interface workflowInputs {
  name: string;
  value: any;
}
