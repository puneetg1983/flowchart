import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgFlowchartStepComponent } from '@joelwenzel/ng-flowchart';
import { FlowHelperService } from 'src/services/FlowHelperService';
import { nodeType, workflowNodeData } from '../models/workflowNode';

export class newNodeModel {
  nodeType: nodeType;
  isParallel: boolean;
}

@Component({
  selector: 'app-node-actions',
  templateUrl: './node-actions.component.html',
  styleUrls: ['./node-actions.component.scss']
})
export class NodeActionsComponent implements OnInit {

  @Input() isConditionNode: boolean = false;
  @Input() isDisabled: boolean = false;
  @Input() isRootNode: boolean = false;

  @Output() onNodeAdded = new EventEmitter<newNodeModel>();
  @Output() onConditionAdded = new EventEmitter<string>();
  @Output() onDeleted = new EventEmitter<boolean>();

  nodeType = nodeType;
  constructor(private _flowHelperService: FlowHelperService) {
  }

  ngOnInit(): void {
  }

  addNode(inputNodeType: nodeType, isParallel: boolean) {
    let newNode = new newNodeModel();
    newNode.isParallel = isParallel;
    newNode.nodeType = inputNodeType;
    this.onNodeAdded.emit(newNode);
  }

  addCondition(conditionType: string) {
    this.onConditionAdded.emit(conditionType);
  }

  deleteNode() {
    this.onDeleted.emit(true);
  }

}
