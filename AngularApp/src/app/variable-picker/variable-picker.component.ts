import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { workflowNodeData } from '../models/workflowNode';

@Component({
  selector: 'app-variable-picker',
  templateUrl: './variable-picker.component.html',
  styleUrls: ['./variable-picker.component.scss']
})
export class VariablePickerComponent implements OnInit {

  @Input() data: workflowNodeData;
  @Input() propertyName: string;
  myControl = new FormControl('');
  filteredOptions: Observable<string[]>;
  constructor() {
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

  updateVariable(event: MatAutocompleteSelectedEvent) {
    this.data[this.propertyName] = event.option.value;
  }
}
