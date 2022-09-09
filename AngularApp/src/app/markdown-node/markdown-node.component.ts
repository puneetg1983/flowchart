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
  styleUrls: ['./markdown-node.component.scss']
})
export class MarkdownNodeComponent extends WorkflowNodeBaseClass implements OnInit {

  defaultMarkdownText: string = "**Sample Text** to be used as markdown. Use any custom `variables` defined in variables section as {YourVariableName}";
  editorOptions: EditorOption;
  bsEditorInstance: EditorInstance;
  uniqueId: string = '';
  promptTypes: string[] = [promptType.automatic, promptType.onClick];
  
  @Input() data: workflowNodeData;


  constructor(private _markdownService: MarkdownService, private _flowHelperServicePrivate: FlowHelperService) {
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
