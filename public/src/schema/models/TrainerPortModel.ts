import {DefaultLinkModel, LinkModel, PortModel} from "storm-react-diagrams";
import {ModelTypes} from "../ModelTypes";
import TrainerLinkModel from "./TrainerLinkModel";
import {LinkModelFactory} from "../LinkModelFactory";

export default class TrainerPortModel extends PortModel {

    private linkFactory: LinkModelFactory;

    constructor(linkFactory: LinkModelFactory) {
        super('port', ModelTypes.TRAINER);
        this.linkFactory = linkFactory;
    }

    createLinkModel(): LinkModel | null {
        return this.linkFactory.newInstance();
    }

    canLinkToPort(otherPort: PortModel): boolean {
        return otherPort.id !== this.id
    }
}
