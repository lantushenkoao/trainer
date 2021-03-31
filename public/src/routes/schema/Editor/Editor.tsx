import * as React from 'react';

import  TrainerNodeWidget from '../../../schema/widgets/TrainerNodeWidget/TrainerNodeWidget';
import {NodeShape} from "../../../schema/NodeShape";
import {
    BaseAction,
    DiagramEngine,
    DiagramModel,
    DiagramWidget, LinkModel,
    MoveItemsAction,
    PointModel,
    PortModel
} from "storm-react-diagrams";
import {createDiagramEngine} from "../../../schema/createDiagramEngine";
import TrainerNodeModel from "../../../schema/models/TrainerNodeModel";
import TrainerPortModel from "../../../schema/models/TrainerPortModel";
import ArrowedLink from '../../../components/ArrowedLink/ArrowedLink';
import * as _ from 'lodash'
import {LinkLine} from "../../../schema/LinkLine";
import {LinkDirectionality} from "../../../schema/LinkDirectionality";
import {ModelTypes} from "../../../schema/ModelTypes";
import TrainerLinkModel from "../../../schema/models/TrainerLinkModel";
import {LinkPaletteValue} from "../LinkPaletteValue";
import './Editor.scss';
import NodeDragAndDropPropertiesProvider from "../NodeDragAndDropPropertiesProvider";

interface Props {
    link: LinkPaletteValue,
    isNodesTextEditable: boolean,
    isNodesResizable: boolean
}

interface State {
}

const MAX_NODES = 30;

export default class Editor extends React.Component<Props, State> {

    private engine: DiagramEngine;
    private diagram: DiagramModel;

    constructor(props: Props) {
        super(props);

        this.engine = createDiagramEngine({
            isNodeResizeEnabled: props.isNodesResizable,
            isNodeTextEditingEnabled: props.isNodesTextEditable,
            linkFactory: {
                newInstance: (): TrainerLinkModel => {
                    const  {link} = this.props;
                    const model = new TrainerLinkModel();
                    model.setLine(link.line);
                    model.setDirectionality(link.directionality);
                    model.setText(link.text);
                    return model;
                }
            }
        });

        this.diagram = new DiagramModel();

        this.engine.setDiagramModel(this.diagram);

        // this.setUpSomeShapes();
    }

    private setUpSomeShapes() {

        const node1 = this.createNewNode();
        node1.setPosition(100, 100);
        node1.setText('Node 1');
        node1.setShape(NodeShape.SQUARE_RECT);

        const node2 = this.createNewNode();
        node2.setPosition(400, 300);
        node2.setShape(NodeShape.ROUND);
        node2.setText('Node 2');

        this.diagram.addAll(node1, node2);
    }

    private createNewNode(): TrainerNodeModel {
        return this.engine.getNodeFactory(ModelTypes.TRAINER).getNewInstance() as TrainerNodeModel;
    }

    public serialize(): any {
        return this.diagram.serializeDiagram();
    }

    public load(ob: any) {
        const model = new DiagramModel();
        model.deSerializeDiagram(ob, this.engine);
        // console.log('before', model);
        this.engine.setDiagramModel(model);
        this.diagram = model;
        this.engine.recalculatePortsVisually();
        this.forceUpdate(() => {/*console.log('after', model)*/});
    }

    private handleLinkClick = (value: LinkPaletteValue) => {
        this.setState({link: value});
    }

    private handleDragOver: React.DragEventHandler = (e) => {
        const nodesCount = _.keys(this.diagram.getNodes()).length;
        if(NodeDragAndDropPropertiesProvider.isNodeDataTransfer(e.dataTransfer) && nodesCount < MAX_NODES) {
            e.preventDefault();
        }
    }

    private handleDragEnd = (event: React.DragEvent<HTMLDivElement>) => {
        const position = this.engine.getRelativeMousePoint(event)
        const data = NodeDragAndDropPropertiesProvider.getNodeDataFromDataTransfer(event.dataTransfer);

        const node = this.createNewNode();
        node.setText(data.text);
        node.setShape(data.shape);
        node.width = data.width;
        node.height = data.height;
        node.setPosition(position.x, position.y);

        this.diagram.addNode(node);
        //necessary to reset some flag to recalculate node dimensions
        this.engine.recalculatePortsVisually();
        this.forceUpdate();
    }

    private handleActionStoppedFiring = (action: BaseAction) => {
        // console.log(action);
    };

    render() {
        return (
            <div styleName="editor">
                <div styleName="editor__container "
                    onDragOver={this.handleDragOver}
                    onDrop={this.handleDragEnd}>
                    <DiagramWidget
                        diagramEngine={this.engine}
                        allowLooseLinks={false}
                        allowCanvasTranslation={false}
                        allowCanvasZoom={true}
                        deleteKeys={[46]}
                        actionStoppedFiring={this.handleActionStoppedFiring}
                    />
                </div>
            </div>
        )
    }
}
