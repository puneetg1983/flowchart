import { Injectable } from "@angular/core";
import { NgFlowchartStepComponent } from "@joelwenzel/ng-flowchart";
import { ConditionIffalseStepComponent } from "src/app/condition-iffalse-step/condition-iffalse-step.component";
import { ConditionIftrueStepComponent } from "src/app/condition-iftrue-step/condition-iftrue-step.component";
import { ConditionStepComponent } from "src/app/condition-step/condition-step.component";
import { workflowNode, workflowNodeData } from "src/app/models/workflowNode";
import { SingleNodeStepComponent } from "src/app/single-node-step/single-node-step.component";
import { SwitchCaseDefaultStepComponent } from "src/app/switch-case-default-step/switch-case-default-step.component";
import { SwitchCaseStepComponent } from "src/app/switch-case-step/switch-case-step.component";
import { SwitchStepComponent } from "src/app/switch-step/switch-step.component";

@Injectable()
export class FlowHelperService {

    detectors: string[] = ['httpservererrors', 'http500', 'http502', 'http503', 'frontendcheck', 'datarolecheck', 'workercheck', 'kustoquery'];

    isDisabled(node: NgFlowchartStepComponent<any>): boolean {
        return node.children.length > 0;
    }

    onDelete(node: NgFlowchartStepComponent<any>) {
        node.destroy(true);
    }

    addDetector(node: NgFlowchartStepComponent<any>) {
        let dataNode = this.getNewDetectorNode(node, this.detectors[0]);
        node.addChild({
            template: SingleNodeStepComponent,
            type: 'detector',
            data: dataNode
        }, {
            sibling: true
        });
    }

    getNewDetectorNode(node: NgFlowchartStepComponent<any>, detectorId: string): workflowNodeData {
        let idNumber = this.getIdNumberForDetector(node, detectorId);
        let wfNodeData = new workflowNodeData();
        wfNodeData.name = detectorId + idNumber;
        wfNodeData.detectorId = detectorId;
        return wfNodeData;
    }

    getIdNumberForDetector(node: NgFlowchartStepComponent<any>, detectorId: string): number {
        let parentNode = node;
        while (parentNode.parent != null) {
            parentNode = parentNode.parent;
        }

        return this.getMaxIdForNode(detectorId, parentNode, 0) + 1;

    }

    getMaxIdForNode(detectorId: string, node: NgFlowchartStepComponent, num: number): number {
        if (node.type === 'detector') {
            let nodeName: string = node.data.name;
            if (nodeName.startsWith(detectorId)) {
                let intPart = nodeName.substring(detectorId.length);
                if (this.is_int(intPart)) {
                    let newNum = parseInt(intPart);
                    num = Math.max(num, newNum);
                }
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

    getAutoCompletions(currentNode: NgFlowchartStepComponent<any>): string[] {
        let completions = [];
        if (currentNode == null) {
            return completions;
        }
        while (currentNode != null) {
            if (currentNode.data.name && currentNode.type == 'detector') {
                completions.push(currentNode.data.name + ".rows[0]['Column1']");
            }
            currentNode = currentNode.parent;
        }

        console.log("Completions = " + completions.length);
        return completions;
    }

    addCondition(node: NgFlowchartStepComponent<any>) {
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

        dataNode.completionOptions = this.getAutoCompletions(node);

        let condtionNode = node.addChild({
            template: ConditionStepComponent,
            type: 'condition',
            data: dataNode
        }, {
            sibling: true
        });

        condtionNode.then((addedNode) => {
            addedNode.addChild({
                template: ConditionIftrueStepComponent,
                type: 'iftrue',
                data: ifDataNode
            }, {
                sibling: true
            });

            addedNode.addChild({
                template: ConditionIffalseStepComponent,
                type: 'iffalse',
                data: elseDataNode
            }, {
                sibling: true
            });
        });

    }

    addSwitchCondition(node: NgFlowchartStepComponent<any>) {
        let wfNode = new workflowNode();
        let swithCaseNode = new workflowNode();
        let switchCaseDefaultNode = new workflowNode();
        swithCaseNode.type = "switchCaseMain";
        switchCaseDefaultNode.type = "switchCaseDefault";

        wfNode.children = [];
        wfNode.children.push(swithCaseNode, switchCaseDefaultNode);

        let dataNode = new workflowNodeData();

        let switchCaseDataNode = new workflowNodeData();
        switchCaseDataNode.name = "switchCase";

        let switchCaseDefaultDataNode = new workflowNodeData();
        switchCaseDefaultDataNode.name = "switchCaseDefault";

        let completionOptions = this.getAutoCompletions(node);
        dataNode.name = "switch-condition";
        dataNode.completionOptions = completionOptions;
        switchCaseDataNode.completionOptions = completionOptions;;

        let condtionNode = node.addChild({
            template: SwitchStepComponent,
            type: 'switchCondition',
            data: dataNode
        }, {
            sibling: true
        });

        condtionNode.then((addedNode) => {
            addedNode.addChild({
                template: SwitchCaseStepComponent,
                type: 'switchCase',
                data: switchCaseDataNode
            }, {
                sibling: true
            });

            addedNode.addChild({
                template: SwitchCaseDefaultStepComponent,
                type: 'switchCaseDefault',
                data: switchCaseDefaultDataNode
            }, {
                sibling: true
            });
        });

    }

    addSwitchCase(node: NgFlowchartStepComponent<any>) {
        let swithCaseNode = new workflowNode();
        swithCaseNode.type = "switchCase";
        let completionOptions: string[] = [];
        let switchCondtionNode = node.parent;

        let switchCaseDataNode = new workflowNodeData();
        switchCaseDataNode.name = "switchCase";

        let switchCaseIndex = switchCondtionNode.children.length - 2;
        switchCondtionNode.addChild({
            template: SwitchCaseStepComponent,
            type: 'switchCase',
            data: switchCaseDataNode
        }, {
            sibling: true,
            index: switchCaseIndex
        });
    }

}