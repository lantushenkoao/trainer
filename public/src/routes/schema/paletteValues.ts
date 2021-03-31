import {NodeShape} from "../../schema/NodeShape";
import {LinkPaletteValue} from "./LinkPaletteValue";
import {LinkDirectionality} from "../../schema/LinkDirectionality";
import {LinkLine} from "../../schema/LinkLine";
import {NodePaletteValue} from "./NodePaletteValue";

const commonNodeOptions = {
    text: '',
    width: 150,
    height: 100
}

export const NODE_PALETTE_OPTIONS: NodePaletteValue[] = [
    {...commonNodeOptions, shape: NodeShape.SQUARE_RECT},
    {...commonNodeOptions, shape: NodeShape.ROUND_RECT},
    {...commonNodeOptions, shape: NodeShape.ROUND},
    {...commonNodeOptions, shape: NodeShape.RHOMBUS},
    {...commonNodeOptions, shape: NodeShape.PARALLELOGRAM},
    {...commonNodeOptions, shape: NodeShape.DOCUMENT},
    {...commonNodeOptions, shape: NodeShape.TRIANGLE},
    {...commonNodeOptions, shape: NodeShape.PENTAGON},
    {...commonNodeOptions, shape: NodeShape.CARD},
    {...commonNodeOptions, shape: NodeShape.TRAPEZOID}
];

export const LINK_PALETTE_OPTIONS: LinkPaletteValue[] = [
    {line: LinkLine.DASHED, directionality: LinkDirectionality.UNDIRECTED, text: ''},
    {line: LinkLine.DASHED, directionality: LinkDirectionality.DIRECTED, text: ''},
    {line: LinkLine.DASHED, directionality: LinkDirectionality.BIDIRECTED, text: ''},
    {line: LinkLine.SOLID, directionality: LinkDirectionality.UNDIRECTED, text: ''},
    {line: LinkLine.SOLID, directionality: LinkDirectionality.DIRECTED, text: ''},
    {line: LinkLine.SOLID, directionality: LinkDirectionality.BIDIRECTED, text: ''},
    {line: LinkLine.SOLID, directionality: LinkDirectionality.DIRECTED, text: 'Да'},
    {line: LinkLine.SOLID, directionality: LinkDirectionality.DIRECTED, text: 'Нет'},
];

export const DEFAULT_PALETTE_OPTION = LINK_PALETTE_OPTIONS[4];