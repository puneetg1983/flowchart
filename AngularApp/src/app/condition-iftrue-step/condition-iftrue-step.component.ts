import { Component, OnInit } from '@angular/core';
import { NgFlowchartStepComponent } from '@joelwenzel/ng-flowchart';
import { FlowHelperService } from 'src/services/FlowHelperService';
import { WorkflowNodeBaseClass } from '../node-base-class';

@Component({
  selector: 'app-condition-iftrue-step',
  templateUrl: './condition-iftrue-step.component.html',
  styleUrls: ['./condition-iftrue-step.component.scss', '../app.component.scss']
})
export class ConditionIftrueStepComponent extends WorkflowNodeBaseClass implements OnInit {

  constructor(private _flowHelperServicePrivate: FlowHelperService) {
    super(_flowHelperServicePrivate);
  }

  ngOnInit(): void {
  }

}
