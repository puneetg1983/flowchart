import { Component, ViewChild, TemplateRef } from '@angular/core';
import {
  NgFlowchartCanvasDirective,
  NgFlowchartStepRegistry,
  NgFlowchart,
  NgFlowchartStepComponent
} from '@joelwenzel/ng-flowchart';
import { workflow, workflowNode, workflowNodeData } from './models/workflowNode';

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

  detectors: string[] = ['frontendcheck', 'datarolecheck', 'workercheck', 'kustoquery']
  selectedDetectors = new Map<string, string>();
  defaultQueryText: string = "<YOUR_TABLE_NAME>\n| where {Utilities.TimeAndTenantFilterQuery(cxt.StartTime, cxt.EndTime, cxt.Resource)}\n| <YOUR_QUERY>";
  captains = ['James T. Kirk', 'Benjamin Sisko', 'Jean-Luc Picard', 'Spock', 'Jonathan Archer', 'Hikaru Sulu', 'Christopher Pike', 'Rachel Garrett'];

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
    wfNode.data.name = this.detectors[0] + "1";
    wfNode.data.detectorId = this.detectors[0];
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

  getAutoCompletions(id: string): string[] {
    let completions = [];
    let currentNode = this.canvas.getFlow().getStep(id);
    if (currentNode == null) {
      return completions;
    }
    while (currentNode.parent != null) {
      if (currentNode.parent.data.name) {
        completions.push(currentNode.parent.data.name + ".rows[0]['Column1']");
      }
      currentNode = currentNode.parent;
    }

    return completions;
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
    let dataNode = this.getNewDetectorNode(this.detectors[0]);
    let currentNode = this.canvas.getFlow().getStep(id);
    currentNode.addChild({
      template: this.normalStepTemplate,
      type: 'detector',
      data: dataNode
    }, {
      sibling: true
    });
  }

  getNewDetectorNode(detectorId: string): workflowNodeData {
    let idNumber = this.getIdNumberForDetector(detectorId);
    let wfNodeData = new workflowNodeData();
    wfNodeData.name = detectorId + idNumber;
    wfNodeData.detectorId = detectorId;
    return wfNodeData;
  }

  getIdNumberForDetector(detectorId: string): number {
    return this.getMaxIdForNode(detectorId, null, 0) + 1;

  }

  getMaxIdForNode(detectorId: string, node: NgFlowchartStepComponent, num: number): number {
    if (node === null) {
      node = this.canvas.getFlow().getRoot();
    }
    let nodeName: string = node.data.name;
    if (nodeName.startsWith(detectorId)) {
      let intPart = nodeName.substring(detectorId.length);
      if (this.is_int(intPart)) {
        let newNum = parseInt(intPart);
        num = Math.max(num, newNum);
      }
    }

    if (node.hasChildren) {
      for (var node of node.children) {
        num = Math.max(num, this.getMaxIdForNode(detectorId, node, num));
      }
      return num;
    } else {
      return num;
    }
  }

  is_int(value) {
    if ((parseInt(value) % 1 === 0)) {
      return true;
    } else {
      return false;
    }
  }

  isDisabled(id: string) {
    if (id === null || this.canvas.getFlow().getStep(id) == null || this.canvas.getFlow().getStep(id).children === null) {
      return false;
    }

    return this.canvas.getFlow().getStep(id).children.length > 0;
  }

  saveDetector(id: string) {
    let currentNode = this.canvas.getFlow().getStep(id);
    let wfNodeData = new workflowNodeData();
    if (!this.selectedDetectors.has(id)) {
      this.selectedDetectors.set(id, this.detectors[0]);
    }

    wfNodeData.detectorId = this.selectedDetectors.get(id);
    let idNumber = this.getIdNumberForDetector(wfNodeData.detectorId);
    wfNodeData.name = wfNodeData.detectorId + idNumber;

    if (wfNodeData.detectorId === "kustoquery") {
      wfNodeData.queryText = this.defaultQueryText;
      wfNodeData.queryTextTemp = wfNodeData.queryText;
    }

    currentNode.data = wfNodeData;
    currentNode.data.isEditing = false;
  }

  saveQuery(id: string) {
    let currentNode = this.canvas.getFlow().getStep(id);
    currentNode.data.queryText = currentNode.data.queryTextTemp;
    currentNode.data.isEditingQuery = false;
  }

  selectDetector(event: any, id: string) {
    this.selectedDetectors.set(id, event.target.value);
  }

  editDetector(id: string) {
    let currentNode = this.canvas.getFlow().getStep(id);
    currentNode.data.isEditing = true;
  }

  editQuery(id: string) {
    let currentNode = this.canvas.getFlow().getStep(id);
    currentNode.data.isEditingQuery = true;
  }

  getSelectedValue(id: string): string {
    return this.selectedDetectors.get(id);
  }

}
