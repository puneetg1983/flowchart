import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgFlowchartStepComponent } from '@joelwenzel/ng-flowchart';
import { Observable } from 'rxjs';
import { FlowHelperService } from 'src/services/FlowHelperService';
import { WorkflowNodeBaseClass } from '../node-base-class';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-condition-step',
  templateUrl: './condition-step.component.html',
  styleUrls: ['./condition-step.component.scss', '../app.component.scss']
})
export class ConditionStepComponent extends WorkflowNodeBaseClass implements OnInit {

  myControl = new FormControl('');
  filteredOptions: Observable<string[]>;
  constructor(private _flowHelperServicePrivate: FlowHelperService) {
    super(_flowHelperServicePrivate);
  }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.data.completionOptions.filter(variable => variable.name.toLowerCase().includes(filterValue)).map(x => x.name);
  }

}
