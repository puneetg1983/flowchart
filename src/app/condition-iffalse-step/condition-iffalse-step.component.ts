import { Component, OnInit } from '@angular/core';
import { NgFlowchartStepComponent } from '@joelwenzel/ng-flowchart';
import { FlowHelperService } from 'src/services/FlowHelperService';

@Component({
  selector: 'app-condition-iffalse-step',
  templateUrl: './condition-iffalse-step.component.html',
  styleUrls: ['./condition-iffalse-step.component.scss', '../app.component.scss']
})
export class ConditionIffalseStepComponent extends NgFlowchartStepComponent implements OnInit {

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
