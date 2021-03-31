import {LinkDirectionality} from "../../schema/LinkDirectionality";
import {LinkLine} from "../../schema/LinkLine";

export interface LinkPaletteValue {
    line: LinkLine,
    directionality: LinkDirectionality,
    text: string
}
