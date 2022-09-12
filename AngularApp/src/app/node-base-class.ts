import { Input } from "@angular/core";
import { NgFlowchartStepComponent } from "@joelwenzel/ng-flowchart";
import { FlowHelperService } from "src/services/FlowHelperService";
import { nodeType, stepVariable, workflowNodeData } from "./models/workflowNode";
import { newNodeModel } from "./node-actions/node-actions.component";

export class WorkflowNodeBaseClass extends NgFlowchartStepComponent {
    constructor(private _flowHelperService: FlowHelperService) {
        super();
    }

    variables: stepVariable[] = [];
    nodeType = nodeType;

    deleteNode() {
        this._flowHelperService.onDelete(this);
    }

    isDisabled() {
        return this._flowHelperService.isDisabled(this);
    }

    isRootNode(){
        return this._flowHelperService.isRootNode(this);
    }

    addNode(newNodeModel: newNodeModel) {
        this._flowHelperService.addNode(this, newNodeModel);
    }

    addCondition(conditionType: string) {
        switch (conditionType) {
            case 'switch':
                this._flowHelperService.addSwitchCondition(this);
                break;
            case 'ifelse':
                this._flowHelperService.addCondition(this);
                break;
            default:
                break;
        }

    }

    addSwitchCase() {
        this._flowHelperService.addSwitchCase(this);
    }
}