import { Injectable } from "@angular/core";
import { NgFlowchartStepComponent } from "@joelwenzel/ng-flowchart";
import { MarkdownComponent } from "ngx-markdown";
import { ConditionIffalseStepComponent } from "src/app/condition-iffalse-step/condition-iffalse-step.component";
import { ConditionIftrueStepComponent } from "src/app/condition-iftrue-step/condition-iftrue-step.component";
import { ConditionStepComponent } from "src/app/condition-step/condition-step.component";
import { DetectorNodeComponent } from "src/app/detector-node/detector-node.component";
import { KustoNodeComponent } from "src/app/kusto-node/kusto-node.component";
import { MarkdownNodeComponent } from "src/app/markdown-node/markdown-node.component";
import { nodeType, stepVariable, workflowNode, workflowNodeData } from "src/app/models/workflowNode";
import { newNodeProperties } from "src/app/node-actions/node-actions.component";
import { SwitchCaseDefaultStepComponent } from "src/app/switch-case-default-step/switch-case-default-step.component";
import { SwitchCaseStepComponent } from "src/app/switch-case-step/switch-case-step.component";
import { SwitchStepComponent } from "src/app/switch-step/switch-step.component";

@Injectable()
export class FlowHelperService {

    detectors: string[] = ['httpservererrors', 'http500', 'http502', 'http503', 'frontendcheck', 'datarolecheck', 'workercheck', 'kustoquery'];

    isDisabled(node: NgFlowchartStepComponent<any>): boolean {
        return node.children.length > 0;
    }

    isRootNode(node: NgFlowchartStepComponent<any>): boolean {
        if (node.parent) {
            return false;
        }
        return true;
    }

    onDelete(node: NgFlowchartStepComponent<any>) {
        node.destroy(true);
    }

    addChildNode(node: NgFlowchartStepComponent<any>, nodeType: nodeType) {
        let newNode: newNodeProperties = new newNodeProperties();
        newNode.isParallel = false;
        newNode.nodeType = nodeType;
        this.addNode(node, newNode);
    }

    addNode(node: NgFlowchartStepComponent<any>, newNode: newNodeProperties) {
        let currentNode = newNode.isParallel ? node.parent : node;
        switch (newNode.nodeType) {
            case nodeType.detector:
                let dataNodeDetector = this.getNewDetectorNode(currentNode, this.detectors[0]);
                currentNode.addChild({
                    template: DetectorNodeComponent,
                    type: 'detector',
                    data: dataNodeDetector
                }, {
                    sibling: true
                });
                break;

            case nodeType.kustoQuery:
                let dataNodeKustoQuery = this.getNewNode(currentNode, 'kustoQuery', "Execute Kusto Query");
                currentNode.addChild({
                    template: KustoNodeComponent,
                    type: 'kustoQuery',
                    data: dataNodeKustoQuery
                }, {
                    sibling: true
                });
                break;

            case nodeType.markdown:
                let dataNodeMarkdown = this.getNewNode(currentNode, 'markdown', "Display Markdown");
                currentNode.addChild({
                    template: MarkdownNodeComponent,
                    type: 'markdown',
                    data: dataNodeMarkdown
                }, {
                    sibling: true
                });
                break;

            default:
                break;
        }
    }

    getNewDetectorNode(node: NgFlowchartStepComponent<any>, detectorId: string): workflowNodeData {
        let idNumber = this.getIdNumberForNode(node, detectorId);
        let wfNodeData = new workflowNodeData();
        wfNodeData.name = detectorId + idNumber;
        wfNodeData.detectorId = detectorId;
        wfNodeData.title = "Execute a detector";
        return wfNodeData;
    }

    getNewNode(node: NgFlowchartStepComponent<any>, nodeId: string, title:string ): workflowNodeData {
        let idNumber = this.getIdNumberForNode(node, nodeId);
        let wfNodeData = new workflowNodeData();
        wfNodeData.name = nodeId + idNumber;
        wfNodeData.title = title;
        return wfNodeData;
    }

    getIdNumberForNode(node: NgFlowchartStepComponent<any>, nodeId: string): number {
        let parentNode = node;
        while (parentNode.parent != null) {
            parentNode = parentNode.parent;
        }

        return this.getMaxIdForNode(nodeId, parentNode, 0) + 1;
    }

    getMaxIdForNode(nodeId: string, node: NgFlowchartStepComponent, num: number): number {
        if (this.isActionNode(node)) {
            let nodeName: string = node.data.name;
            if (nodeName.startsWith(nodeId)) {
                let intPart = nodeName.substring(nodeId.length);
                if (this.is_int(intPart)) {
                    let newNum = parseInt(intPart);
                    num = Math.max(num, newNum);
                }
            }
        }

        if (node.hasChildren) {
            for (var node of node.children) {
                num = Math.max(num, this.getMaxIdForNode(nodeId, node, num));
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
        let ifTrueDataNode = new workflowNodeData();
        ifTrueDataNode.name = "iftrue";
        ifTrueDataNode.title = "If True"

        let ifFalseDataNode = new workflowNodeData();
        ifFalseDataNode.name = "iffalse";
        ifFalseDataNode.title = "If False";
        dataNode.name = "some-condition";
        dataNode.title = "Condition";

        dataNode.completionOptions = this.getVariableCompletionOptions(node);

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
                data: ifTrueDataNode
            }, {
                sibling: true
            });

            addedNode.addChild({
                template: ConditionIffalseStepComponent,
                type: 'iffalse',
                data: ifFalseDataNode
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
        switchCaseDataNode.title = "Case";

        let switchCaseDefaultDataNode = new workflowNodeData();
        switchCaseDefaultDataNode.name = "switchCaseDefault";
        switchCaseDefaultDataNode.title = "Default";

        let completionOptions = this.getVariableCompletionOptions(node);
        dataNode.name = "switch-condition";
        dataNode.title="Switch";
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
        let switchCondtionNode = node.parent;

        let switchCaseDataNode = new workflowNodeData();
        switchCaseDataNode.name = "switchCase";
        switchCaseDataNode.title = "Case";
        switchCaseDataNode.completionOptions = this.getVariableCompletionOptions(node);

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

    isActionNode(node: NgFlowchartStepComponent<any>): boolean {
        if (node.type === 'detector'
            || node.type === 'markdown'
            || node.type === 'kustoQuery') {
            return true;
        }

        return false;
    }

    getVariableCompletionOptions(node: NgFlowchartStepComponent<any>): stepVariable[] {
        let allVariables : stepVariable[] = [];
        let currentNode = node;
        while (currentNode != null) {
            if (this.isActionNode(currentNode)){
                allVariables = allVariables.concat(currentNode.data.variables);
            }
            currentNode = currentNode.parent;
        }
        return allVariables;
    }

}