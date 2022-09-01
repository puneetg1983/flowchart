import { Component, OnInit } from '@angular/core';
import { NgFlowchartStepComponent } from '@joelwenzel/ng-flowchart';
import { FlowHelperService } from 'src/services/FlowHelperService';

@Component({
  selector: 'app-switch-case-step',
  templateUrl: './switch-case-step.component.html',
  styleUrls: ['./switch-case-step.component.scss', '../app.component.scss']
})
export class SwitchCaseStepComponent extends NgFlowchartStepComponent implements OnInit {

  constructor(private _flowHelperService:FlowHelperService) {
    super();
  }

  ngOnInit(): void {
  }

  isDisabled() {
    return this._flowHelperService.isDisabled(this);
  }

  addDetector() {
    this._flowHelperService.addDetector(this);
  }

  addSwitchCase(){
    this._flowHelperService.addSwitchCase(this);
  }

  onDelete(){
    this._flowHelperService.onDelete(this);
  }

}
