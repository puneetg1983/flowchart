import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { kustoQuery, KustoService } from 'src/services/KustoService';

@Component({
  selector: 'app-kusto-query-dialog',
  templateUrl: './kusto-query-dialog.component.html',
  styleUrls: ['./kusto-query-dialog.component.scss']
})
export class KustoQueryDialogComponent implements OnInit {

  editorOptions = { theme: 'vs-dark', language: 'text/plain', minimap: { enabled: false } };
  code: string = '';
  displayedColumns: string[] = [];
  dataSource: any[] = [];
  variables: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) data: { queryText: string }, public dialogRef: MatDialogRef<KustoQueryDialogComponent>,
    private _kustoService: KustoService) {
    this.code = decodeURI(data.queryText);
  }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close('');
  }

  save() {
    this.dialogRef.close(encodeURI(this.code));
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

    this._kustoService.execute(kustoQuery).subscribe(resp => {
      this.displayedColumns = [];
      resp.body.columns.forEach(entry => {
        this.displayedColumns.push(entry.columnName);
      })

      for (var i = 0; i < resp.body.rows.length; i++) {
        let obj = {};
        for (var j = 0; j < resp.body.rows[i].length; j++) {
          obj[this.displayedColumns[j]] = resp.body.rows[i][j];
        }
        this.dataSource.push(obj);
      }

    });
  }

  clickCell(rowIndex, colName) {
    let value = 'this.rows[' + rowIndex + '][\"' + colName + '\"]';
    let name = 'kustoQuery1_' + colName + '_Row' + rowIndex;

    if (this.variables.findIndex(x => x.name === name) === -1) {
      this.variables.push({ name: name, value: value });
    }
  }

}
