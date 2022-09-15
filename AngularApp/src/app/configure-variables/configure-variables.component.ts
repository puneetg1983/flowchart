import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { stepVariable } from '../models/workflowNode';

const regex: RegExp = /this\.rows\[(\d+)]\['(\w+)'\]/gm

@Component({
  selector: 'app-configure-variables',
  templateUrl: './configure-variables.component.html',
  styleUrls: ['./configure-variables.component.scss']
})
export class ConfigureVariablesComponent implements OnInit {

  @Input() variables: stepVariable[] = [];
  @Output() onVariablesSaved = new EventEmitter<stepVariable[]>();

  currentVariable: stepVariable = new stepVariable();
  dataTypes: string[] = ['String', 'Int32', 'Int64', 'Double', 'DateTime'];
  isEditing: boolean = false;
  variableHasError: boolean = false;
  errorMessage = "Variable names should be of the format this.rows[0]['ColumnName']";
  editIndex = -1;
  constructor() {
  }

  ngOnInit(): void {
  }

  save() {
    let idx = this.variables.findIndex(x => x.name === this.currentVariable.name);
    if (idx === -1) {
      this.variables.push(this.currentVariable);
    } else {
      this.variables[idx] = this.currentVariable;
    }

    this.editIndex = -1;
    this.isEditing = false;
    this.onVariablesSaved.emit(this.variables);
  }

  addNew() {
    this.editIndex = -1;
    this.currentVariable = new stepVariable();
    this.currentVariable.name = 'CustomVariableForThisStep';
    this.currentVariable.value = 'this.rows[0][\'ColumnName\']';
    this.isEditing = true;
  }

  delete(idx: number) {
    this.variables.splice(idx, 1);
    this.onVariablesSaved.emit(this.variables);
  }

  edit(idx: number) {
    this.isEditing = true;
    this.editIndex = idx;
    this.currentVariable = this.variables[idx];
  }

  onVariableChange(event: any) {
    let updatedValue = event.target.value;
    regex.lastIndex = 0;
    this.variableHasError = !regex.test(updatedValue);
  }

}
