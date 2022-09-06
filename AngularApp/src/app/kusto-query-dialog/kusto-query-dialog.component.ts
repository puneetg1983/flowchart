import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-kusto-query-dialog',
  templateUrl: './kusto-query-dialog.component.html',
  styleUrls: ['./kusto-query-dialog.component.scss']
})
export class KustoQueryDialogComponent implements OnInit {

  editorOptions = { theme: 'vs-dark', language: 'text/plain', minimap: { enabled: false } };
  code: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) data: { queryText: string }, public dialogRef: MatDialogRef<KustoQueryDialogComponent>) {
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


}
