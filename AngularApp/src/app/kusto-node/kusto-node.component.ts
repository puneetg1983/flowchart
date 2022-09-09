import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NgFlowchartStepComponent } from '@joelwenzel/ng-flowchart';
import { FlowHelperService } from 'src/services/FlowHelperService';
import { ConfigureVariablesComponent } from '../configure-variables/configure-variables.component';
import { KustoQueryDialogComponent } from '../kusto-query-dialog/kusto-query-dialog.component';
import { stepVariable, workflowNodeData } from '../models/workflowNode';
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
    const dialogConfig = this.getNewMatDialogConfig();
    let dataInObject = this.data.queryText !== '' ? { queryText: this.data.queryText } : { queryText: this.defaultQueryText };
    dialogConfig.data = dataInObject;
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

  configureVariables() {
    const dialogConfig = this.getNewMatDialogConfig();
    let existingVariables = this.getVariables();
    dialogConfig.data = existingVariables;

    this.matDialog.open(ConfigureVariablesComponent, dialogConfig).afterClosed().subscribe(modelData => {
    });

  }

  getVariables(): stepVariable[] {
    let stepVars: stepVariable[] = [];
    let currentNode: NgFlowchartStepComponent<workflowNodeData> = this;
    while (currentNode != null) {
      if (this._flowHelperServicePrivate.isActionNode(currentNode)) {
        currentNode.data.variables.forEach(v => {
          stepVars.push(v);
        })
      }
      currentNode = currentNode.parent;
    }
    return stepVars;
  }

  getNewMatDialogConfig(): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.height = "calc(100% - 30px)";
    dialogConfig.width = "calc(100% - 30px)";
    dialogConfig.maxWidth = "100%";
    dialogConfig.maxHeight = "100%";
    dialogConfig.disableClose = true;
    return dialogConfig;
  }

}
