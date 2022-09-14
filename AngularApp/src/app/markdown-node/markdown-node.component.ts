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

  defaultMarkdownText: string = "**Sample Text** to be used as markdown. Use any custom `variables` defined in variables section as {YourVariableName}";
  editorOptions: EditorOption;
  bsEditorInstance: EditorInstance;
  uniqueId: string;

  @Input() data: workflowNodeData;

  constructor(private _flowHelperServicePrivate: FlowHelperService, private _markdownService: MarkdownService) {
    super(_flowHelperServicePrivate);
    this.uniqueId = Date.now().toString();
  }

  ngOnInit(): void {
    this.editorOptions = {
      autofocus: false,
      iconlibrary: 'fa',
      savable: false,
      onShow: (e) => this.bsEditorInstance = e,
      parser: (val) => this.parse(val)
    };

    if (this.data.markdownText === '') {
      this.data.markdownText = this.defaultMarkdownText;
    }
  }

  parse(inputValue: string) {
    const markedOutput = this._markdownService.compile(inputValue.trim());
    return markedOutput;
  }

}
