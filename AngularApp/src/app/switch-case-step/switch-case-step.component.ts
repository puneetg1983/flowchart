import { Component, OnInit } from '@angular/core';
import { NgFlowchartStepComponent } from '@joelwenzel/ng-flowchart';
import { FlowHelperService } from 'src/services/FlowHelperService';
import { nodeType } from '../models/workflowNode';
import { WorkflowNodeBaseClass } from '../node-base-class';

@Component({
  selector: 'app-switch-case-step',
  templateUrl: './switch-case-step.component.html',
  styleUrls: ['./switch-case-step.component.scss', '../app.component.scss']
})
export class SwitchCaseStepComponent extends WorkflowNodeBaseClass implements OnInit {

  constructor(private _flowHelperServicePrivate: FlowHelperService) {
    super(_flowHelperServicePrivate);
  }

  ngOnInit(): void {
  }

}
