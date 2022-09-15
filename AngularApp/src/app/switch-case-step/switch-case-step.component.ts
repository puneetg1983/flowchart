import { Component, OnInit } from '@angular/core';
import { FlowHelperService } from 'src/services/FlowHelperService';
import { stepVariable } from '../models/workflowNode';
import { WorkflowNodeBaseClass } from '../node-base-class';

@Component({
  selector: 'app-switch-case-step',
  templateUrl: './switch-case-step.component.html',
  styleUrls: ['./switch-case-step.component.scss', '../node-styles.scss']
})
export class SwitchCaseStepComponent extends WorkflowNodeBaseClass implements OnInit {

  switchCaseValue: string;
  error: any;
  currentVariable: stepVariable;
  integerDataTypes: string[] = ['Int32', 'Int64', 'Double'];
  editMode: boolean = true;
  constructor(private _flowHelperServicePrivate: FlowHelperService) {
    super(_flowHelperServicePrivate);
  }

  ngOnInit(): void {
  }

  populateCurrentVariable() {
    this.error = '';
    let switchConditionNode = this.parent;
    if (switchConditionNode != null) {
      let variableName = switchConditionNode.data.switchOnValue;
      if (variableName != null) {
        if (this.data.completionOptions.length > 0) {
          let idx = this.data.completionOptions.findIndex(x => x.name === variableName);
          if (idx > -1) {
            this.currentVariable = JSON.parse(JSON.stringify(this.data.completionOptions[idx]));
            return;
          } else {
            this.error = "Invalid variable chosen in Switch step"
          }
        }
      } else {
        this.error = "Please choose a variable in Switch step"
      }
    }
  }

  save() {
    this.error = '';
    this.populateCurrentVariable();
    if (this.currentVariable.type === 'String') {
      this.data.switchCaseValue = this.switchCaseValue;
      this.editMode = false;
    } else if (this.integerDataTypes.indexOf(this.currentVariable.type) > -1) {
      if (!this.isNumber(this.switchCaseValue)) {
        this.error = "The datatype of the variable in the switch is a numeric but the value is not a number";
      } else {
        this.data.switchCaseValue = this.switchCaseValue;
        this.editMode = false;
      }
    }
  }

  //https://stackoverflow.com/a/1421988/1900166
  isNumber(n): boolean {
    return !isNaN(parseFloat(n)) && !isNaN(n - 0)
  }

}
