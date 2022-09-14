import { Component, Input, OnInit } from '@angular/core';
import { EditorInstance, EditorOption } from 'angular-markdown-editor';
import { MarkdownService } from 'ngx-markdown';
import { nodeStatus, promptType } from '../models/workflowNode';

@Component({
  selector: 'app-common-node-properties',
  templateUrl: './common-node-properties.component.html',
  styleUrls: ['./common-node-properties.component.scss']
})
export class CommonNodePropertiesComponent implements OnInit {

  promptTypes: string[] = Object.keys(promptType);
  nodeStatuses: string[] = Object.keys(nodeStatus);
  uniqueId: string;
  defaultMarkdownText: string = "**Sample Text** to be used as markdown. Use any custom `variables` defined in variables section as {YourVariableName}";
  editorOptions: EditorOption;
  bsEditorInstance: EditorInstance;

  @Input() showMarkdown: boolean = true;
  @Input() data: any;

  constructor(private _markdownService: MarkdownService) {
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
