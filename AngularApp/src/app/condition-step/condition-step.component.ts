import { Component, OnInit } from '@angular/core';
import { NgFlowchartStepComponent } from '@joelwenzel/ng-flowchart';
import { FlowHelperService } from 'src/services/FlowHelperService';
import { WorkflowNodeBaseClass } from '../node-base-class';

@Component({
  selector: 'app-condition-step',
  templateUrl: './condition-step.component.html',
  styleUrls: ['./condition-step.component.scss', '../app.component.scss']
})
export class ConditionStepComponent extends WorkflowNodeBaseClass implements OnInit {

  constructor(private _flowHelperServicePrivate: FlowHelperService) {
    super(_flowHelperServicePrivate);
  }

  ngOnInit(): void {
  }

}
