import {DiagramEngine, NodeModel, PortModel} from 'storm-react-diagrams';
import {NodeShape} from "../NodeShape";
import {ModelTypes} from "../ModelTypes";
import TrainerPortModel from "./TrainerPortModel";
import * as _ from "lodash";
import {Size} from "../../types/Size";

export default class TrainerNodeModel extends NodeModel {
    private _shape: NodeShape;
    private _text: string = '';

    constructor(port: PortModel, id?: string) {
        super(ModelTypes.TRAINER, id);
        this.addPort(port);
    }


    serialize() {
        return _.merge(super.serialize(), {
            shape: this._shape,
            text: this._text,
            width: this.width,
            height: this.height
        });
    }

    deSerialize(ob: any, engine: DiagramEngine): void {
        super.deSerialize(ob, engine);
        this._shape = ob.shape;
        this._text = ob.text;
        this.width = ob.width;
        this.height = ob.height;
    }


    updateDimensions({width, height}: { width: number; height: number }): void {
        // prevent updating node dimensions by framework - we have dimensions set explicitly
        // super.updateDimensions({width, height});
    }

    setDimensions(size: Size): void {
        this.width = size.width;
        this.height = size.height;
    }

    getShape() {
        return this._shape;
    }

    setShape(shape: NodeShape) {
        this._shape = shape;
    }

    getText(): string {
        return this._text;
    }

    setText(value: string) {
        this._text = value;
    }
}
