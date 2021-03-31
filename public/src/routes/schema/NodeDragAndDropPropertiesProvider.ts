import {NodePaletteValue} from "./NodePaletteValue";
import * as _ from "lodash";

const DATA_TRANSFER_TYPE = 'text/x-trainer';

export default class NodeDragAndDropPropertiesProvider {

    static putNodeDataToDataTransfer(dataTransfer: DataTransfer, nodeData: NodePaletteValue) {
        dataTransfer.setData(DATA_TRANSFER_TYPE, JSON.stringify(nodeData));
    }

    static isNodeDataTransfer(dataTransfer: DataTransfer): boolean {
        return _.includes(dataTransfer.types, DATA_TRANSFER_TYPE);
    }

    static getNodeDataFromDataTransfer(dataTransfer: DataTransfer): NodePaletteValue {
        return JSON.parse(dataTransfer.getData(DATA_TRANSFER_TYPE));
    }
}
