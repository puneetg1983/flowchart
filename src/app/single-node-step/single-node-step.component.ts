import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgFlowchartStepComponent } from '@joelwenzel/ng-flowchart';
import { FlowHelperService } from 'src/services/FlowHelperService';
import { nodeType, workflowNode, workflowNodeData } from '../models/workflowNode';
import { SwitchCaseDefaultStepComponent } from '../switch-case-default-step/switch-case-default-step.component';
import { SwitchCaseStepComponent } from '../switch-case-step/switch-case-step.component';

@Component({
  selector: 'single-node-step',
  templateUrl: './single-node-step.component.html',
  styleUrls: ['./single-node-step.component.scss', '../app.component.scss']
})
export class SingleNodeStepComponent extends NgFlowchartStepComponent implements OnInit {

  @Input() data: workflowNodeData;
  _flowHelperService: FlowHelperService;

  constructor(flowHelperService: FlowHelperService) {
    super();
    this._flowHelperService = flowHelperService;
  }

  nodeTypes: string[] = Object.keys(nodeType);
  detectors: string[] = ['httpservererrors', 'http500', 'http502', 'http503', 'frontendcheck', 'datarolecheck', 'workercheck'];
  selectedDetectors = new Map<string, string>();
  defaultQueryText: string = "<YOUR_TABLE_NAME>\n| where {Utilities.TimeAndTenantFilterQuery(cxt.StartTime, cxt.EndTime, cxt.Resource)}\n| <YOUR_QUERY>";

  ngOnInit(): void {
  }

  isDisabled() {
    return this._flowHelperService.isDisabled(this);
  }

  addDetector() {
    this._flowHelperService.addDetector(this);
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

  saveQuery() {
    this.data.queryText = this.data.queryTextTemp;
    this.data.isEditingQuery = false;
  }

  selectDetector(event: any) {
    this.selectedDetectors.set(this.id, event.target.value);
  }

  changeNodeType(event: any) {
    this.data.nodeType = event.target.value;
    if (this.data.nodeType === nodeType.kustoQuery) {
      let idNumber = this._flowHelperService.getIdNumberForDetector(this, "kustoQuery");
      this.data.name = "kustoQuery" + idNumber;
      this.data.queryText = this.defaultQueryText;
      this.data.queryTextTemp = this.defaultQueryText;
    } else {
      this.data.queryText = "";
      let idNumber = this._flowHelperService.getIdNumberForDetector(this, this.data.detectorId);
      this.data.name = this.data.detectorId + idNumber;
    }

  }

  editDetector() {
    this.data.isEditing = true;
  }

  editQuery() {
    this.data.isEditingQuery = true;
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

}
