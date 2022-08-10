import { Component, ViewChild, TemplateRef } from '@angular/core';
import {
  NgFlowchartCanvasDirective,
  NgFlowchartStepRegistry,
  NgFlowchart
} from '@joelwenzel/ng-flowchart';
import { workflow, workflowNode, workflowNodeData } from './models/workflowNode';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'flowchart';

  callbacks: NgFlowchart.Callbacks = {};
  options: NgFlowchart.Options = {
    stepGap: 40,
    rootPosition: 'TOP_CENTER'
  };

  @ViewChild('normalStep')
  normalStepTemplate: TemplateRef<any>;

  @ViewChild('conditionStep')
  conditionStepTemplate: TemplateRef<any>;

  @ViewChild('ifTrueStep')
  ifTrueTemplate: TemplateRef<any>;

  @ViewChild('ifFalseStep')
  ifFalseTemplate: TemplateRef<any>;

  @ViewChild(NgFlowchartCanvasDirective)
  canvas: NgFlowchartCanvasDirective;

  disabled = false;

  constructor(private stepRegistry: NgFlowchartStepRegistry) {
    this.callbacks.onDropError = this.onDropError;
    this.callbacks.onMoveError = this.onMoveError;
  }

  ngAfterViewInit() {
    this.stepRegistry.registerStep('detector', this.normalStepTemplate);
    this.stepRegistry.registerStep('condition', this.conditionStepTemplate);
    this.stepRegistry.registerStep('iftrue', this.ifTrueTemplate);
    this.stepRegistry.registerStep('iffalse', this.ifFalseTemplate);
    this.showUpload();
  }

  onDropError(error: NgFlowchart.DropError) {
    console.log(error);
  }

  onMoveError(error: NgFlowchart.MoveError) {
    console.log(error);
  }

  showUpload() {
    let wf = new workflow();
    let wfNode = new workflowNode();
    wfNode.type = "detector";
    wfNode.data = new workflowNodeData();
    wfNode.data.name = "Detector1";
    wfNode.children = [];

    wf.root = wfNode;
    this.canvas.getFlow().upload(wf);

    // this.http.get("./assets/mydata.json").subscribe(data => {
    //   this.canvas.getFlow().upload(data);
    // });
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

  onGapChanged(event) {
    this.options = {
      ...this.options,
      stepGap: parseInt(event.target.value)
    };
  }

  onSequentialChange(event) {
    this.options = {
      ...this.options,
      isSequential: event.target.checked
    };
  }

  onDelete(id) {
    this.canvas
      .getFlow()
      .getStep(id)
      .destroy(true);
  }

  addCondition(id) {
    let wfNode = new workflowNode();
    let wfIfTrueNode = new workflowNode();
    let wfIfFalseNode = new workflowNode();

    wfIfTrueNode.type = "iftrue";
    wfIfFalseNode.type = "iffalse";

    wfNode.children = [];
    wfNode.children.push(wfIfTrueNode);
    wfNode.children.push(wfIfFalseNode);

    let dataNode = new workflowNodeData();
    let ifDataNode = new workflowNodeData();
    ifDataNode.name = "iftrue";

    let elseDataNode = new workflowNodeData();
    elseDataNode.name = "iffalse";

    dataNode.name = "some-condition";
    let currentNode = this.canvas.getFlow().getStep(id);
    let condtionNode = currentNode.addChild({
      template: this.conditionStepTemplate,
      type: 'condition',
      data: dataNode
    }, {
      sibling: true
    });

    condtionNode.then((addedNode) => {
      addedNode.addChild({
        template: this.ifTrueTemplate,
        type: 'iftrue',
        data: ifDataNode
      }, {
        sibling: true
      });

      addedNode.addChild({
        template: this.ifFalseTemplate,
        type: 'iffalse',
        data: elseDataNode
      }, {
        sibling: true
      });
    });

  }

  addDetector(id: string) {
    let dataNode = this.getNewDetectorNode("Detector1");
    let currentNode = this.canvas.getFlow().getStep(id);
    currentNode.addChild({
      template: this.normalStepTemplate,
      type: 'detector',
      data: dataNode
    }, {
      sibling: true
    });
  }

  getNewWorkFlowDataNode(name: string): workflowNodeData {
    let wfNodeData = new workflowNodeData();
    wfNodeData.name = name;
    return wfNodeData;
  }

  getNewDetectorNode(detectorId: string): workflowNodeData {
    return this.getNewWorkFlowDataNode(detectorId);
  }

  isDisabled(id: string) {
    if (id === null || this.canvas.getFlow().getStep(id) == null || this.canvas.getFlow().getStep(id).children === null) {
      return false;
    }

    return this.canvas.getFlow().getStep(id).children.length > 0;
  }

}
