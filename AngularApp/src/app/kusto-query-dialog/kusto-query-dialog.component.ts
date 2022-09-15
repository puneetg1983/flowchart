import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataTableResponseColumn, kustoQuery, KustoService } from 'src/services/KustoService';
import { kustoQueryDialogParams } from '../models/kusto';
import { stepVariable } from '../models/workflowNode';

@Component({
  selector: 'app-kusto-query-dialog',
  templateUrl: './kusto-query-dialog.component.html',
  styleUrls: ['./kusto-query-dialog.component.scss']
})

export class KustoQueryDialogComponent implements OnInit {

  // More editor options at https://github.com/Microsoft/vscode/issues/30795#issuecomment-410998882
  editorOptions = { theme: 'vs-dark', language: 'text/plain', minimap: { enabled: false } };
  code: string = '';
  kustoQueryColumns: DataTableResponseColumn[] = [];
  dataSource: any[] = [];
  variables: stepVariable[] = [];
  variablesInMemoryCopy: stepVariable[] = [];
  isExecutingQuery: boolean = false;
  error: string = '';
  kustoQueryLabel: string = 'ThisStepKustoQueryLabel';
  variablesChanged: boolean = false;
  inputKustoQueryDialogParams: kustoQueryDialogParams;

  constructor(@Inject(MAT_DIALOG_DATA) data: kustoQueryDialogParams, public dialogRef: MatDialogRef<KustoQueryDialogComponent>,
    private _kustoService: KustoService) {
    this.inputKustoQueryDialogParams = data;
    this.code = data.queryText;
    if (data.queryLabel) {
      this.kustoQueryLabel = data.queryLabel;
    }

    this.variables = data.variables;
    this.variablesInMemoryCopy = JSON.parse(JSON.stringify(data.variables));
  }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close(null);
  }

  save() {
    let dialogResult: kustoQueryDialogParams = {
      queryText: this.encodeString(this.code),
      variables: this.variablesInMemoryCopy,
      queryLabel: this.kustoQueryLabel,
      kustoQueryColumns: this.kustoQueryColumns,
      completionOptions: this.inputKustoQueryDialogParams.completionOptions
    };

    this.dialogRef.close(dialogResult);
  }

  executeQuery() {
    let kustoQuery: kustoQuery = {
      ClusterName: 'wawseas',
      DatabaseName: 'wawsprod',
      OperationName: 'TestOperation',
      QueryText: this.code,
      StartTime: '',
      EndTime: '',
      Variables: this.inputKustoQueryDialogParams.completionOptions
    };

    this.error = '';
    this.isExecutingQuery = true;
    this._kustoService.execute(kustoQuery).subscribe(resp => {
      this.isExecutingQuery = false;
      this.kustoQueryColumns = [];
      resp.body.columns.forEach(entry => {
        this.kustoQueryColumns.push(entry);
      })

      this.dataSource = [];
      for (var i = 0; i < resp.body.rows.length; i++) {
        let obj = {};
        for (var j = 0; j < resp.body.rows[i].length; j++) {
          obj[this.kustoQueryColumns[j].columnName] = resp.body.rows[i][j];
        }
        this.dataSource.push(obj);
      }

    }, error => {
      this.isExecutingQuery = false;
      if (error.error) {
        this.error = error.error;
      } else {
        this.error = JSON.stringify(error);
      }
    });
  }

  clickCell(rowIndex: number, col: DataTableResponseColumn, element: any) {
    let value = "this.rows[" + rowIndex + "]['" + col.columnName + "']";
    let name = this.kustoQueryLabel + '_Row' + rowIndex + '_' + col.columnName;

    const newVariableArray: stepVariable[] = [];
    this.variablesInMemoryCopy.forEach(element => {
      newVariableArray.push(element);
    })

    if (newVariableArray.findIndex(x => x.name === name) === -1) {
      newVariableArray.push({
        name: name,
        value: value,
        type: col.dataType,
        runtimeValue: element[col.columnName]
      });
    }

    this.variablesInMemoryCopy = [...newVariableArray]; // refresh the dataSource
  }

  getColumnNames(kustoQueryColumns: DataTableResponseColumn[]): string[] {
    let colNames: string[] = [];
    kustoQueryColumns.forEach(col => {
      colNames.push(col.columnName);
    });

    return colNames;
  }

  encodeString(input: string): string {
    return btoa(input);
  }

  updateVariables(variables: stepVariable[]) {
    this.variablesInMemoryCopy = variables;
    if (this.variables.length != this.variablesInMemoryCopy.length) {
      this.variablesChanged = true;
      return;
    }

    this.variablesChanged = JSON.stringify(this.variables) === JSON.stringify(this.variablesInMemoryCopy);
  }

}
