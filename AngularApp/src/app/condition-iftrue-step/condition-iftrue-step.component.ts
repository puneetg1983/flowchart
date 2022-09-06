import { Component, OnInit } from '@angular/core';
import { NgFlowchartStepComponent } from '@joelwenzel/ng-flowchart';
import { FlowHelperService } from 'src/services/FlowHelperService';

@Component({
  selector: 'app-condition-iftrue-step',
  templateUrl: './condition-iftrue-step.component.html',
  styleUrls: ['./condition-iftrue-step.component.scss', '../app.component.scss']
})
export class ConditionIftrueStepComponent extends NgFlowchartStepComponent implements OnInit {

  constructor(private _flowHelperService: FlowHelperService) {
    super();
  }

  ngOnInit(): void {
  }

  addDetector() {
    this._flowHelperService.addDetector(this);
  }

  isDisabled() {
    return this._flowHelperService.isDisabled(this);
  }

}
