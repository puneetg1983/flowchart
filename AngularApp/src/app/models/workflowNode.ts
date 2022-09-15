import { DataTableResponseColumn } from "src/services/KustoService";

export enum nodeStatus {
  critical = 'critical',
  warning = 'warning',
  success = 'success',
  info = 'info'
}

export enum nodeType {
  detector = 'detector',
  kustoQuery = 'kustoQuery',
  markdown = 'markdown'
}

export enum promptType {
  automatic = 'automatic',
  onClick = 'onClick'
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

export class stepVariable {
  name: string = '';
  type: string = 'String';
  value: string = '';
  runtimeValue: any;
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
  queryLabel: string = '';
  kustoQueryColumns: DataTableResponseColumn[] = [];
  variables: stepVariable[] = [];
  markdownText: string = '';
  completionOptions: stepVariable[] = [];
  promptType: promptType = promptType.automatic;
  status: nodeStatus = nodeStatus.info;
  conditionValue: string;
  ifconditionLeftValue: string;
  ifconditionRightValue: string;
  switchOnValue: string;
  switchCaseValue: string;
}
