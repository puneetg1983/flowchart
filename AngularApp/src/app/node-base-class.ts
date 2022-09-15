import { Input } from "@angular/core";
import { NgFlowchartStepComponent } from "@joelwenzel/ng-flowchart";
import { FlowHelperService } from "src/services/FlowHelperService";
import { nodeType, stepVariable, workflowNodeData } from "./models/workflowNode";
import { newNodeProperties } from "./node-actions/node-actions.component";
import Swal from 'sweetalert2'

const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-danger',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  });

export class WorkflowNodeBaseClass extends NgFlowchartStepComponent<workflowNodeData> {
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

    isRootNode() {
        return this._flowHelperService.isRootNode(this);
    }

    addNode(newNodeProperties: newNodeProperties) {
        this._flowHelperService.addNode(this, newNodeProperties);
    }

    addChildNode(nodeType: nodeType) {
        this._flowHelperService.addChildNode(this, nodeType);
    }

    addCondition(conditionType: string) {
        if (this._flowHelperService.getVariableCompletionOptions(this).length === 0) {
            swalWithBootstrapButtons.fire("Error", "You cannot add any conditions because you have not added any variables yet. Please add some variables first and then add conditions.", 'error');
            return;
        }

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
        if (this._flowHelperService.getVariableCompletionOptions(this).length === 0) {
            swalWithBootstrapButtons.fire("Error", "You cannot add any conditions because you have not added any variables yet. Please add some variables first and then add conditions.", 'error');
            return;
        }

        this._flowHelperService.addSwitchCase(this);
    }
}