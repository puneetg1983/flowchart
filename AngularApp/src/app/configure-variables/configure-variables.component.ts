import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { KustoService } from 'src/services/KustoService';
import { stepVariable } from '../models/workflowNode';

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

  constructor() {
  }

  ngOnInit(): void {
  }

  add() {
    this.variables.push(this.currentVariable);
    this.currentVariable = new stepVariable();
    this.isEditing = false;
  }

  addNew() {
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

}
