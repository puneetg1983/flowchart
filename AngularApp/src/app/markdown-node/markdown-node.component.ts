import { Component, Input, OnInit } from '@angular/core';
import { NgFlowchartStepComponent } from '@joelwenzel/ng-flowchart';
import { EditorInstance, EditorOption } from 'angular-markdown-editor';
import { MarkdownService } from 'ngx-markdown';
import { FlowHelperService } from 'src/services/FlowHelperService';
import { promptType, workflowNodeData } from '../models/workflowNode';
import { WorkflowNodeBaseClass } from '../node-base-class';

@Component({
  selector: 'app-markdown-node',
  templateUrl: './markdown-node.component.html',
  styleUrls: ['./markdown-node.component.scss', '../node-styles.scss']
})
export class MarkdownNodeComponent extends WorkflowNodeBaseClass implements OnInit {

  @Input() data: workflowNodeData;


  constructor(private _flowHelperServicePrivate: FlowHelperService) {
    super(_flowHelperServicePrivate);
  }

  ngOnInit(): void {
  }

}
