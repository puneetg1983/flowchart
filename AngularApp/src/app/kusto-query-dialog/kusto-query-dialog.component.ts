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
  displayedColumns: DataTableResponseColumn[] = [];
  dataSource: any[] = [];
  variables: stepVariable[] = [];
  isExecutingQuery: boolean = false;
  error: string = '';
  kustoQueryLabel: string = 'ThisStepKustoQueryLabel';

  constructor(@Inject(MAT_DIALOG_DATA) data: kustoQueryDialogParams, public dialogRef: MatDialogRef<KustoQueryDialogComponent>,
    private _kustoService: KustoService) {
    this.code = decodeURI(data.queryText);
    if (data.queryLabel) {
      this.kustoQueryLabel = data.queryLabel;
    }

    this.variables = data.variables;
  }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close({ queryText: '', variables: [] });
  }

  save() {
    let dialogResult: kustoQueryDialogParams = {
      queryText: encodeURI(this.code),
      variables: this.variables,
      queryLabel: this.kustoQueryLabel
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
      EndTime: ''
    };

    this.error = '';
    this.isExecutingQuery = true;
    this._kustoService.execute(kustoQuery).subscribe(resp => {
      this.isExecutingQuery = false;
      this.displayedColumns = [];
      resp.body.columns.forEach(entry => {
        this.displayedColumns.push(entry);
      })

      for (var i = 0; i < resp.body.rows.length; i++) {
        let obj = {};
        for (var j = 0; j < resp.body.rows[i].length; j++) {
          obj[this.displayedColumns[j].columnName] = resp.body.rows[i][j];
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

  clickCell(rowIndex: number, col: DataTableResponseColumn) {
    let value = "this.rows[" + rowIndex + "]['" + col.columnName + "']";
    let name = this.kustoQueryLabel + '_Row' + rowIndex + '_' + col.columnName;

    const newVariableArray: stepVariable[] = [];
    this.variables.forEach(element => {
      newVariableArray.push(element);
    })

    if (newVariableArray.findIndex(x => x.name === name) === -1) {
      newVariableArray.push({
        name: name,
        value: value,
        type: col.dataType
      });
    }

    this.variables = [...newVariableArray]; // refresh the dataSource
  }

  getColumnNames(displayedColumns: DataTableResponseColumn[]): string[] {
    let colNames: string[] = [];
    displayedColumns.forEach(col => {
      colNames.push(col.columnName);
    });

    return colNames;
  }

}
