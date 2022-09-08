import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgFlowchartStepComponent } from '@joelwenzel/ng-flowchart';
import { FlowHelperService } from 'src/services/FlowHelperService';
import { nodeType, workflowNodeData } from '../models/workflowNode';

@Component({
  selector: 'app-node-actions',
  templateUrl: './node-actions.component.html',
  styleUrls: ['./node-actions.component.scss']
})
export class NodeActionsComponent implements OnInit {

  @Input() isConditionNode: boolean = false;
  @Input() isDisabled: boolean = false;

  @Output() onNodeAdded = new EventEmitter<nodeType>();
  @Output() onConditionAdded = new EventEmitter<string>();
  @Output() onDeleted = new EventEmitter<boolean>();

  nodeType = nodeType;
  constructor(private _flowHelperService: FlowHelperService) {
  }

  ngOnInit(): void {
  }

  addNode(inputNodeType: nodeType) {
    this.onNodeAdded.emit(inputNodeType);
  }

  addCondition(conditionType: string) {
    this.onConditionAdded.emit(conditionType);
  }

  deleteNode() {
    this.onDeleted.emit(true);
  }

}
