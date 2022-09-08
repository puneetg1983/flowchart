import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FlowHelperService } from 'src/services/FlowHelperService';
import { KustoQueryDialogComponent } from '../kusto-query-dialog/kusto-query-dialog.component';
import { workflowNodeData } from '../models/workflowNode';
import { WorkflowNodeBaseClass } from '../node-base-class';

@Component({
  selector: 'app-kusto-node',
  templateUrl: './kusto-node.component.html',
  styleUrls: ['./kusto-node.component.scss']
})
export class KustoNodeComponent extends WorkflowNodeBaseClass implements OnInit {

  defaultQueryText: string = "RoleInstanceHeartbeat\n| where TIMESTAMP > ago(1h)\n| take 5\n| project TIMESTAMP, Details, BuildVersion, OSVersion";

  @Input() data: workflowNodeData;

  constructor(private _flowHelperServicePrivate: FlowHelperService, private matDialog: MatDialog) {
    super(_flowHelperServicePrivate);
  }

  ngOnInit(): void {
  }

  configureKustoQuery() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.height = "calc(100% - 30px)";
    dialogConfig.width = "calc(100% - 30px)";
    dialogConfig.maxWidth = "100%";
    dialogConfig.maxHeight = "100%";
    dialogConfig.disableClose = true;

    this.data.queryText !== '' ? dialogConfig.data = { queryText: this.data.queryText } : dialogConfig.data = { queryText: this.defaultQueryText }
    this.matDialog.open(KustoQueryDialogComponent, dialogConfig).afterClosed().subscribe(modelData => {
      if (modelData.queryText !== '') {
        this.data.queryText = modelData.queryText;
      }

      if (modelData.variables.length > 0) {
        this.variables = this.variables.concat(modelData.variables);
      }
      this.data.variables = this.variables;
    });
  }

}
