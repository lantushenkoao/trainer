import * as _ from "lodash";

export function isEqualSchema(left: any, right: any): boolean {
    if(isEmptySchema(left) && isEmptySchema(right)) {
        return true;
    } else if(isEmptySchema(left) !== isEmptySchema(right)) {
        return false;
    } else {
        return _.isEqual(preProcessSchema(left), preProcessSchema(right));
    }
}

const isEmptySchema = (schema: any) => {
    if(schema !== null) {
        return schema.nodes.length === 0;
    } else {
        return true;
    }
}

const preProcessSchema = (schema: any) => {
    const  copy = JSON.parse(JSON.stringify(schema));
    copy.links.forEach((link: any) => delete link.points);
    return copy;
}
