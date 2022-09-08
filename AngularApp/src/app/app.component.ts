import { Component, ViewChild, TemplateRef } from '@angular/core';
import {
  NgFlowchartCanvasDirective,
  NgFlowchartStepRegistry,
  NgFlowchart
} from '@joelwenzel/ng-flowchart';
import { DetectorNodeComponent } from './detector-node/detector-node.component';
import { KustoNodeComponent } from './kusto-node/kusto-node.component';
import { MarkdownNodeComponent } from './markdown-node/markdown-node.component';
import { nodeType, workflow, workflowNode, workflowNodeData } from './models/workflowNode';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'flowchart';
  searchStr = "";
  callbacks: NgFlowchart.Callbacks = {};
  options: NgFlowchart.Options = {
    stepGap: 40,
    rootPosition: 'TOP_CENTER',
    zoom: {
      mode: 'DISABLED'
    }
  };


  @ViewChild(NgFlowchartCanvasDirective)
  canvas: NgFlowchartCanvasDirective;

  disabled = false;
  detectors: string[] = ['httpservererrors', 'http500', 'http502', 'http503', 'frontendcheck', 'datarolecheck', 'workercheck'];
  nodeType = nodeType;

  constructor(private stepRegistry: NgFlowchartStepRegistry) {
    this.callbacks.onDropError = this.onDropError;
    this.callbacks.onMoveError = this.onMoveError;
  }

  ngAfterViewInit() {
    this.stepRegistry.registerStep('detector', DetectorNodeComponent);
    this.stepRegistry.registerStep('kustoQuery', KustoNodeComponent);
    this.stepRegistry.registerStep('markdown', MarkdownNodeComponent);
  }

  onDropError(error: NgFlowchart.DropError) {
    console.log(error);
  }

  onMoveError(error: NgFlowchart.MoveError) {
    console.log(error);
  }

  addNode(type: nodeType) {
    let wf = new workflow();
    let wfNode = new workflowNode();
    wfNode.data = new workflowNodeData();

    if (type === nodeType.detector) {
      wfNode.type = "detector";
      wfNode.data.name = this.detectors[0] + "1";
      wfNode.data.detectorId = this.detectors[0];
      wfNode.data.title = this.detectors[0] + "-Title";

    } else if (type === nodeType.kustoQuery) {
      wfNode.type = "kustoQuery";
      wfNode.data.name = "kustoQuery1";
      wfNode.data.title = "kustoQuery1-Title";
    } else if (type === nodeType.markdown) {
      wfNode.type = "markdown";
      wfNode.data.name = "markdown1";
      wfNode.data.title = "markdown1-Title";
    }

    wfNode.children = [];
    wf.root = wfNode;
    this.canvas.getFlow().upload(wf);
  }

  showFlowData() {
    let json = this.canvas.getFlow().toJSON(4);

    var x = window.open();
    x.document.open();
    x.document.write(
      '<html><head><title>Flowchart Json</title></head><body><pre>' +
      json +
      '</pre></body></html>'
    );
    x.document.close();
  }

  clearData() {
    this.canvas.getFlow().clear();
  }

  isDisabled() {
   return false;
  }

  onDelete(id) {
    this.canvas
      .getFlow()
      .getStep(id)
      .destroy(true);
  }

}
