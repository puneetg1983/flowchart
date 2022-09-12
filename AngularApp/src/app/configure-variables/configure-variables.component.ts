import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { KustoService } from 'src/services/KustoService';
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
  dataTypes: string[] = ['String', 'Int32', 'Double', 'DateTime'];
  isEditing: boolean = false;
  variableHasError: boolean = false;
  errorMessage = "Variable names should be of the format this.rows[0]['ColumnName']";

  constructor() {
  }

  ngOnInit(): void {
  }

  add() {
    this.variables.push(this.currentVariable);
    this.isEditing = false;
  }

  addNew() {
    this.currentVariable = new stepVariable();
    this.currentVariable.name = 'CustomVariableForThisStep';
    this.currentVariable.value = 'this.rows[0][\'ColumnName\']';
    this.isEditing = true;
  }

  save() {
    this.onVariablesSaved.emit(this.variables);
  }

  edit(idx: number) {
    this.isEditing = true;
    this.currentVariable = this.variables[idx];

  }

  delete(idx: number) {
    this.variables.splice(idx, 1);
  }

  onVariableChange(event: any) {
    let updatedValue = event.target.value;
    regex.lastIndex = 0;
    this.variableHasError = !regex.test(updatedValue);
  }

}
