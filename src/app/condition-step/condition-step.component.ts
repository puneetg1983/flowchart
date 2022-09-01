import { Component, OnInit } from '@angular/core';
import { NgFlowchartStepComponent } from '@joelwenzel/ng-flowchart';
import { FlowHelperService } from 'src/services/FlowHelperService';

@Component({
  selector: 'app-condition-step',
  templateUrl: './condition-step.component.html',
  styleUrls: ['./condition-step.component.scss', '../app.component.scss']
})
export class ConditionStepComponent extends NgFlowchartStepComponent implements OnInit {

  constructor(private _flowHelperService:FlowHelperService) { 
    super();
  }

  ngOnInit(): void {
  }

  onDelete(){
    this._flowHelperService.onDelete(this);
  }

}
