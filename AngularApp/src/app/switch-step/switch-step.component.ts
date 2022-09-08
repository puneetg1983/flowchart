import { Component, OnInit } from '@angular/core';
import { NgFlowchartStepComponent } from '@joelwenzel/ng-flowchart';
import { FlowHelperService } from 'src/services/FlowHelperService';
import { WorkflowNodeBaseClass } from '../node-base-class';

@Component({
  selector: 'app-switch-step',
  templateUrl: './switch-step.component.html',
  styleUrls: ['./switch-step.component.scss', '../app.component.scss']
})
export class SwitchStepComponent extends WorkflowNodeBaseClass implements OnInit {

  constructor(private _flowHelperServicePrivate: FlowHelperService) {
    super(_flowHelperServicePrivate);
  }

  ngOnInit(): void {
  }

}
