import * as React from 'react';
import {
    DiagramEngine,
    DefaultLinkFactory,
    DefaultLinkModel, AbstractNodeFactory, AbstractLinkFactory, AbstractPortFactory,
} from "storm-react-diagrams";

import TrainerLinkModel from "./models/TrainerLinkModel";
import TrainerNodeModel from "./models/TrainerNodeModel";
import TrainerLinkWidget from "./widgets/TrainerLinkWidget/TrainerLinkWidget";
import TrainerNodeWidget from "./widgets/TrainerNodeWidget/TrainerNodeWidget";

import {ModelTypes} from "./ModelTypes";
import * as _ from 'lodash';
import {LinkModelFactory} from "./LinkModelFactory";
import TrainerPortModel from "./models/TrainerPortModel";
import {Size} from "../types/Size";

interface Config {
    isNodeTextEditingEnabled: boolean,
    isNodeResizeEnabled: boolean,
    linkFactory: LinkModelFactory
}

export const createDiagramEngine = (config: Config): DiagramEngine => {
    const engine = new DiagramEngine();
    engine.installDefaultFactories();
    engine.registerLinkFactory(new TrainerLinkFactory(config.linkFactory));
    engine.registerNodeFactory(new TrainerNodeFactory(config));
    engine.registerPortFactory(new TrainerPortFactory(config.linkFactory));

    return engine;
}

class TrainerLinkFactory extends AbstractLinkFactory<TrainerLinkModel> {

    private linkFactory: LinkModelFactory;

    constructor(linkFactory: LinkModelFactory) {
        super(ModelTypes.TRAINER);
        this.linkFactory = linkFactory;
    }

    generateReactWidget(diagramEngine: DiagramEngine, link: TrainerLinkModel): JSX.Element {
        return React.createElement(TrainerLinkWidget, {link});
    }

    getNewInstance(initialConfig?: any): TrainerLinkModel {
        return this.linkFactory.newInstance();
    }
}

class TrainerNodeFactory extends AbstractNodeFactory<TrainerNodeModel> {

    private linkFactory: LinkModelFactory;
    private isTextEditingEnabled: boolean;
    private isResizeEnabled: boolean;

    constructor(config: Config) {
        super(ModelTypes.TRAINER);
        this.linkFactory = config.linkFactory;
        this.isTextEditingEnabled = config.isNodeTextEditingEnabled;
        this.isResizeEnabled = config.isNodeResizeEnabled;
    }

    generateReactWidget(diagramEngine: DiagramEngine, node: TrainerNodeModel): JSX.Element {
        const {width, height} = node;
        const size = isFinite(width) && isFinite(height)
            ? {width, height}
            : {width: 100, height: 100};

        const onDimensionsChange = (size: Size) => {
            this.handleNodeDimensionsChange(diagramEngine, node, size);
        };

        const onTextChange = (text: string) => {
            node.setText(text);
            diagramEngine.repaintCanvas();
        };

        return React.createElement(TrainerNodeWidget, {
            shape: node.getShape(),
            text: node.getText(),
            size,
            diagramScale: diagramEngine.getDiagramModel().getZoomLevel() / 100,
            isSelected: node.isSelected(),
            ports: _.values(node.getPorts()),
            onTextChange: this.isTextEditingEnabled ? onTextChange : undefined,
            onDimensionsChange: this.isResizeEnabled ? onDimensionsChange : undefined
        });
    }

    private handleNodeDimensionsChange(diagramEngine: DiagramEngine, node: TrainerNodeModel, size: Size) {
        node.setDimensions(size);

        // in order to recalculate ports/points positions
        diagramEngine.linksThatHaveInitiallyRendered = {};
        diagramEngine.nodesRendered = true;
        diagramEngine.repaintCanvas();
        //
    }

    getNewInstance(initialConfig?: any): TrainerNodeModel {
        return new TrainerNodeModel(new TrainerPortModel(this.linkFactory));
    }
}

class TrainerPortFactory extends AbstractPortFactory<TrainerPortModel> {

    private linkFactory: LinkModelFactory;

    constructor(linkFactory: LinkModelFactory) {
        super(ModelTypes.TRAINER);
        this.linkFactory = linkFactory;
    }

    getNewInstance(initialConfig?: any): TrainerPortModel {
        return new TrainerPortModel(this.linkFactory);
    }
}