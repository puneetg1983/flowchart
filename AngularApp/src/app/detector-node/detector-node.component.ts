import { Component, Input, OnInit } from '@angular/core';
import { FlowHelperService } from 'src/services/FlowHelperService';
import { workflowNodeData } from '../models/workflowNode';
import { WorkflowNodeBaseClass } from '../node-base-class';

@Component({
  selector: 'app-detector-node',
  templateUrl: './detector-node.component.html',
  styleUrls: ['./detector-node.component.scss']
})
export class DetectorNodeComponent extends WorkflowNodeBaseClass implements OnInit {

  detectors: string[] = ['httpservererrors', 'http500', 'http502', 'http503', 'frontendcheck', 'datarolecheck', 'workercheck'];
  selectedDetectors = new Map<string, string>();

  @Input() data: workflowNodeData;

  constructor(private _flowHelperServicePrivate: FlowHelperService) {
    super(_flowHelperServicePrivate);
  }

  ngOnInit(): void {
  }

  editDetector() {
    this.data.isEditing = true;
  }

  getSelectedValue(id: string): string {
    return this.selectedDetectors.get(id);
  }

  changeDetector() {
    let idNumber = this._flowHelperServicePrivate.getIdNumberForNode(this, this.data.detectorId);
    this.data.name = this.data.detectorId + idNumber;
  }

  saveDetector() {
    if (!this.selectedDetectors.has(this.id)) {
      this.selectedDetectors.set(this.id, this.detectors[0]);
    }

    this.data.detectorId = this.selectedDetectors.get(this.id);
    let idNumber = this._flowHelperServicePrivate.getIdNumberForNode(this, this.data.detectorId);
    this.data.name = this.data.detectorId + idNumber;
    this.data.isEditing = false;
  }

  selectDetector(event: any) {
    this.selectedDetectors.set(this.id, event.target.value);
  }
}
