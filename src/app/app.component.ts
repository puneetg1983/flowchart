import { Component, ViewChild, TemplateRef } from '@angular/core';
import {
  NgFlowchartCanvasDirective,
  NgFlowchartStepRegistry,
  NgFlowchart
} from '@joelwenzel/ng-flowchart';
import { workflow, workflowNode, workflowNodeData } from './models/workflowNode';
import { SingleNodeStepComponent } from './single-node-step/single-node-step.component';

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
  detectors: string[] = ['httpservererrors', 'http500', 'http502', 'http503', 'frontendcheck', 'datarolecheck', 'workercheck', 'kustoquery'];

  constructor(private stepRegistry: NgFlowchartStepRegistry) {
    this.callbacks.onDropError = this.onDropError;
    this.callbacks.onMoveError = this.onMoveError;
  }

  ngAfterViewInit() {
    this.stepRegistry.registerStep('detector', SingleNodeStepComponent);
    // this.stepRegistry.registerStep('condition', ConditionStepComponent);
    // this.stepRegistry.registerStep('iftrue', ConditionIftrueStepComponent);
    // this.stepRegistry.registerStep('iffalse', ConditionIffalseStepComponent);
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
    wfNode.data.title = this.detectors[0] + "-Title";
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

}
