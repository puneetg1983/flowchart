import { Component, OnInit } from '@angular/core';
import { NgFlowchartStepComponent } from '@joelwenzel/ng-flowchart';
import { FlowHelperService } from 'src/services/FlowHelperService';

@Component({
  selector: 'app-switch-case-default-step',
  templateUrl: './switch-case-default-step.component.html',
  styleUrls: ['./switch-case-default-step.component.scss', '../app.component.scss']
})
export class SwitchCaseDefaultStepComponent extends NgFlowchartStepComponent implements OnInit {

  constructor(private _flowHelperService: FlowHelperService) {
    super();

  }

  ngOnInit(): void {
  }

  addDetector() {
    this._flowHelperService.addDetector(this);

  }

  onDelete() {
    this._flowHelperService.onDelete(this);
  }

  isDisabled() {
    return this._flowHelperService.isDisabled(this);
  }

}
