import * as React from 'react';

import {LinkLine} from "../../schema/LinkLine";
import {LinkDirectionality} from "../../schema/LinkDirectionality";
import {Point} from "../../types/Point";
import LinkArrow from "../LinkArrow/LinkArrow";
import './ArrowedLink.scss';
import * as _ from "lodash";

interface Props {
    width: number,
    isSelected: boolean,
    line: LinkLine,
    directionality: LinkDirectionality,
    text: string,
    start: Point,
    end: Point
}

export default class ArrowedLink extends React.Component<Props, {}> {

    render() {
        const {props} = this;
        const {start, end} = props;


        const angleRaw = calculateAngleBetweenXasisAndDirectionToStartPoint(start, end);
        const angleForEndArrow = 180 - (angleRaw - 90);
        const angleForStartArrow = angleForEndArrow + 180;

        const middle = {
            x: (start.x + end.x) / 2,
            y: (start.y + end.y) / 2
        };

        const path = `M${start.x} ${start.y} L${end.x} ${end.y}`;
        return (
            <>
                <path
                    strokeWidth={props.width}
                    styleName={`link__path link__path--${props.line}`}
                    d={path}
                />
                <path
                    strokeWidth={props.width * 15}
                    styleName="link__path-area"
                    d={path}
                />
                {props.directionality === LinkDirectionality.BIDIRECTED && (
                    <PositionedArrow
                        target={start}
                        angle={angleForStartArrow}
                        width={props.width}
                    />
                )}
                {_.includes([LinkDirectionality.DIRECTED, LinkDirectionality.BIDIRECTED], props.directionality) && (
                    <PositionedArrow
                        target={end}
                        angle={angleForEndArrow}
                        width={props.width}
                    />
                )}
                {props.isSelected && (
                    <circle
                        cx={middle.x}
                        cy={middle.y}
                        r={5}
                        styleName="link__middle"
                    />
                )}
                <text x={middle.x} y={middle.y}>
                    {props.text}
                </text>
            </>
        )
    }
}

const PositionedArrow = (props: {target: Point, angle: number, width: number}) => {
    const transformValue = [
        `rotate(${props.angle || 0} ${props.target.x} ${props.target.y})`,
        `translate(-15 0)`,
        `translate(${props.target.x} ${props.target.y})`
    ]. join(' ');
    return (
        <g transform={transformValue}>
            <LinkArrow width={props.width}/>
        </g>
    )
}

const calculateAngleBetweenXasisAndDirectionToStartPoint = (start: Point, end: Point) => {
    const tgAlpha = (end.x - start.x) / Math.abs(end.y - start.y);
    const alpha = radiansToDegrees(Math.atan(tgAlpha));
    if(end.y > start.y) {
        return alpha + 90;
    } else {
        return 270 - alpha;
    }
};

const radiansToDegrees = (rad: number): number => rad * 180 / Math.PI;
