import { Component, OnInit } from '@angular/core';
import { NgFlowchartStepComponent } from '@joelwenzel/ng-flowchart';
import { FlowHelperService } from 'src/services/FlowHelperService';

@Component({
  selector: 'app-switch-step',
  templateUrl: './switch-step.component.html',
  styleUrls: ['./switch-step.component.scss', '../app.component.scss']
})
export class SwitchStepComponent extends NgFlowchartStepComponent<any> implements OnInit {

  constructor(private _flowHelperService: FlowHelperService) {
    super();
  }

  ngOnInit(): void {
  }

  onDelete() {
    this._flowHelperService.onDelete(this);
  }

}
