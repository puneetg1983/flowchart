import { Component, Input, OnInit } from '@angular/core';
import { nodeStatus, promptType } from '../models/workflowNode';

@Component({
  selector: 'app-common-node-properties',
  templateUrl: './common-node-properties.component.html',
  styleUrls: ['./common-node-properties.component.scss']
})
export class CommonNodePropertiesComponent implements OnInit {

  promptTypes: string[] = Object.keys(promptType);
  nodeStatuses: string[] = Object.keys(nodeStatus);

  @Input() data: any;
  constructor() { }

  ngOnInit(): void {
  }

}
