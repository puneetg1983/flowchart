import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NgFlowchartStepComponent } from '@joelwenzel/ng-flowchart';
import { FlowHelperService } from 'src/services/FlowHelperService';
import { ConfigureVariablesComponent } from '../configure-variables/configure-variables.component';
import { KustoQueryDialogComponent } from '../kusto-query-dialog/kusto-query-dialog.component';
import { kustoQueryDialogParams } from '../models/kusto';
import { promptType, stepVariable, workflowNodeData } from '../models/workflowNode';
import { WorkflowNodeBaseClass } from '../node-base-class';

@Component({
  selector: 'app-kusto-node',
  templateUrl: './kusto-node.component.html',
  styleUrls: ['./kusto-node.component.scss', '../node-styles.scss']
})
export class KustoNodeComponent extends WorkflowNodeBaseClass implements OnInit {

  @Input() data: workflowNodeData;

  defaultQueryText: string = "RoleInstanceHeartbeat\n| where TIMESTAMP > ago(1h)\n| take 5\n| project TIMESTAMP, Details, BuildVersion, OSVersion";
  promptTypes: string[] = [promptType.automatic, promptType.onClick];

  constructor(private _flowHelperServicePrivate: FlowHelperService, private matDialog: MatDialog) {
    super(_flowHelperServicePrivate);
  }

  ngOnInit(): void {
  }

  configureKustoQuery() {
    const dialogConfig = this.getNewMatDialogConfig();
    let dialogParams: kustoQueryDialogParams = new kustoQueryDialogParams();
    dialogParams.queryText = this.data.queryText !== '' ? this.decodeString(this.data.queryText) : this.defaultQueryText;
    dialogParams.queryLabel = this.data.queryLabel;
    dialogParams.variables = this.data.variables;
    dialogParams.kustoQueryColumns = this.data.kustoQueryColumns;

    dialogConfig.data = dialogParams;
    this.matDialog.open(KustoQueryDialogComponent, dialogConfig).afterClosed().subscribe(modelData => {
      if (modelData != null) {
        this.variables = modelData.variables;
        this.data.queryLabel = modelData.queryLabel;
        this.data.queryText = modelData.queryText;
        this.data.variables = this.variables;
        this.data.kustoQueryColumns = modelData.kustoQueryColumns;
        this.data.completionOptions = this._flowHelperServicePrivate.getVariableCompletionOptions(this);
      }
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

  getQueryText(queryText: string) {
    if (!queryText) {
      return '(Specify query by clicking the "Configure Kusto Query" button)';
    }
    let queryTextPlain = this.decodeString(queryText);
    return queryTextPlain.length > 100 ? queryTextPlain.substring(0, 100) + '...' : queryTextPlain;
  }

  decodeString(input: string): string {
    return Buffer.from(input, 'base64').toString('binary');
  }

}
