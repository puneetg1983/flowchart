export enum nodeStatus {
  critical,
  warning,
  success,
  info
}

export enum nodeType {
  detector = 'detector',
  kustoQuery = 'kustoQuery',
  markdown = 'markdown'
}

export enum promptType {
  automatic,
  onClick
}

export class workflow {
  root: workflowNode;
}
export class workflowNode {
  id: string;
  type: string;
  data: workflowNodeData;
  children: workflowNode[];
}

export interface stepVariable {
  name: string;
  type: string;
  value: string;
}

export class workflowNodeData {
  name: string = '';
  title: string = '';
  description: string = '';
  nodeType: nodeType = nodeType.detector;
  detectorId: string = '';
  isEditing: boolean = false;
  isEditingTitle: boolean = false;
  queryText: string = '';
  variables: stepVariable[] = [];
  markdownText: string = '';
  completionOptions: string[] = [];
  promptType: promptType = promptType.automatic;
  status: nodeStatus = nodeStatus.info;
  conditionValue: string;
}
