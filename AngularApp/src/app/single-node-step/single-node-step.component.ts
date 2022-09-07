import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NgFlowchart, NgFlowchartStepComponent } from '@joelwenzel/ng-flowchart';
import { EditorInstance, EditorOption } from 'angular-markdown-editor';
import { FlowHelperService } from 'src/services/FlowHelperService';
import { KustoQueryDialogComponent } from '../kusto-query-dialog/kusto-query-dialog.component';
import { nodeType, stepVariable, workflowNodeData } from '../models/workflowNode';
import { MarkdownService } from 'ngx-markdown';

@Component({
  selector: 'single-node-step',
  templateUrl: './single-node-step.component.html',
  styleUrls: ['./single-node-step.component.scss', '../app.component.scss']
})
export class SingleNodeStepComponent extends NgFlowchartStepComponent implements OnInit {

  @Input() data: workflowNodeData;
  _flowHelperService: FlowHelperService;

  constructor(flowHelperService: FlowHelperService, private matDialog: MatDialog, private markdownService: MarkdownService) {
    super();
    this._flowHelperService = flowHelperService;
  }

  nodeTypes: string[] = Object.keys(nodeType);
  detectors: string[] = ['httpservererrors', 'http500', 'http502', 'http503', 'frontendcheck', 'datarolecheck', 'workercheck'];
  selectedDetectors = new Map<string, string>();
  defaultQueryText: string = "RoleInstanceHeartbeat\n| where TIMESTAMP > ago(1h)\n| take 5\n| project TIMESTAMP, Details, BuildVersion, OSVersion";
  defaultMarkdownText: string = "**Sample Text** to be used as markdown. Use any custom `variables` defined in variables section as {YourVariableName}";
  editorOptions: EditorOption;
  bsEditorInstance: EditorInstance;
  variables: stepVariable[] = [];

  ngOnInit(): void {

    this.editorOptions = {
      autofocus: false,
      iconlibrary: 'fa',
      savable: false,
      onShow: (e) => this.bsEditorInstance = e,
      parser: (val) => this.parse(val)
    };
  }

  parse(inputValue: string) {
    const markedOutput = this.markdownService.compile(inputValue.trim());
    return markedOutput;
  }

  isDisabled() {
    return this._flowHelperService.isDisabled(this);
  }

  addDetector() {
    this._flowHelperService.addDetector(this);
  }

  changeDetector() {
    let idNumber = this._flowHelperService.getIdNumberForDetector(this, this.data.detectorId);
    this.data.name = this.data.detectorId + idNumber;
  }

  saveDetector() {
    if (!this.selectedDetectors.has(this.id)) {
      this.selectedDetectors.set(this.id, this.detectors[0]);
    }

    this.data.detectorId = this.selectedDetectors.get(this.id);
    let idNumber = this._flowHelperService.getIdNumberForDetector(this, this.data.detectorId);
    this.data.name = this.data.detectorId + idNumber;
    this.data.isEditing = false;
  }
  selectDetector(event: any) {
    this.selectedDetectors.set(this.id, event.target.value);
  }

  changeNodeType(event: any) {
    this.data.nodeType = event.value;
    if (this.data.nodeType === nodeType.kustoQuery) {
      let idNumber = this._flowHelperService.getIdNumberForDetector(this, "kustoQuery");
      this.data.name = "kustoQuery" + idNumber;
      this.data.queryText = this.defaultQueryText;
    } else {
      this.data.queryText = "";
      let idNumber = this._flowHelperService.getIdNumberForDetector(this, this.data.detectorId);
      this.data.name = this.data.detectorId + idNumber;
    }

    if (this.data.nodeType === nodeType.markdown && this.data.markdownText === '') {
      this.data.markdownText = this.defaultMarkdownText;
    }
  }

  editDetector() {
    this.data.isEditing = true;
  }

  getSelectedValue(id: string): string {
    return this.selectedDetectors.get(id);
  }

  onDelete() {
    this._flowHelperService.onDelete(this);
  }

  addSwitchCondition() {
    this._flowHelperService.addSwitchCondition(this);
  }

  addCondition() {
    this._flowHelperService.addCondition(this);
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

  canDrop(dropEvent: NgFlowchart.DropTarget): boolean {
    return false;
  }

}
