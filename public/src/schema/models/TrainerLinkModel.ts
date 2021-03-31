import {DefaultLinkModel, DiagramEngine} from "storm-react-diagrams";
import {ModelTypes} from "../ModelTypes";
import {LinkLine} from "../LinkLine";
import {LinkDirectionality} from "../LinkDirectionality";
import * as _ from "lodash";

export default class TrainerLinkModel extends DefaultLinkModel {

    private _line: LinkLine = LinkLine.DASHED;
    private _directionality: LinkDirectionality = LinkDirectionality.DIRECTED;
    private _text: string = '';

    constructor() {
        super(ModelTypes.TRAINER);
        this.width = 1;
    }

    serialize() {
        return _.extend(super.serialize(), {
            line: this._line,
            directionality: this._directionality,
            text: this._text
        });
    }

    deSerialize(ob: any, engine: DiagramEngine): void {
        super.deSerialize(ob, engine);
        this._line = ob.line;
        this._directionality = ob.directionality;
        this._text = ob.text;
    }

    getLine(): LinkLine {
        return this._line;
    }

    setLine(value: LinkLine) {
        this._line = value;
    }

    getDirectionality(): LinkDirectionality {
        return this._directionality;
    }

    setDirectionality(value: LinkDirectionality) {
        this._directionality = value;
    }

    getText(): string {
        return this._text;
    }

    setText(value: string) {
        this._text = value;
    }
}
