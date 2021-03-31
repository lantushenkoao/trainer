import * as React from 'react';
import * as SRD from "storm-react-diagrams";

import './TrainerLinkWidget.scss';
import LinkArrow from '../../../components/LinkArrow/LinkArrow';
import TrainerLinkModel from "../../models/TrainerLinkModel";
import {Point} from "../../../types/Point";
import ArrowedLink from "../../../components/ArrowedLink/ArrowedLink";

export default class TrainerLinkWidget extends React.Component<{link: TrainerLinkModel}, {}> {

    _handleClickOnEnd: React.MouseEventHandler = (e) => {
        this.props.link.getLastPoint().setSelected(true);
        this.forceUpdate();
    }

    render() {
        const {link} = this.props;

        const start = link.getFirstPoint();
        const end = link.getLastPoint();

        const dx = Math.abs(start.x - end.x);
        const dy = Math.abs(start.y - end.y);

        let arrowEndPoint: Point = end;
        if(link.getTargetPort() !== null) {
            const intersection = calcLineIntersectionWithBoundingBoxWithMagic(end, link.getTargetPort().getNode(), start);
            if (intersection !== null) {
                arrowEndPoint = intersection;
            }
        }

        let arrowStartPoint: Point = start;
        if(link.getSourcePort() !== null) {
            const intersection = calcLineIntersectionWithBoundingBoxWithMagic(start, link.getSourcePort().getNode(), end);
            if (intersection !== null) {
                arrowStartPoint = intersection;
            }
        }

        return (
            <g>
                <g data-linkid={link.id}>
                    <ArrowedLink
                        start={arrowStartPoint}
                        end={arrowEndPoint}
                        width={link.width}
                        isSelected={link.isSelected()}
                        line={link.getLine()}
                        directionality={link.getDirectionality()}
                        text={link.getText()}
                    />
                </g>
                {false && <circle
                    cx={arrowEndPoint.x}
                    cy={arrowEndPoint.y}
                    r={3}
                    styleName="link__point"
                    data-id={end.id}
                    data-linkid={link.id}
                    onMouseDown={this._handleClickOnEnd}
                />}
            </g>
        );
    }
}

const calcLineIntersectionWithBoundingBoxWithMagic = (pointInside: Point, node: SRD.NodeModel, pointOutside: Point): Point | null => {

    if([node.x, node.y, node.width, node.height].some((n) => !isFinite(n))) {
        // console.log('not finite');
        return null;
    }

    const topLeft: Point = node;
    const topRight = {x: node.x + node.width, y: node.y};
    const bottomLeft = {
        x: node.x,
        y: node.y + node.height
    };
    const bottomRight = {
        x: node.x + node.width,
        y: node.y + node.height
    };
    const points = [
        calcIntersectionPoint(topLeft, topRight, pointInside, pointOutside),
        calcIntersectionPoint(topRight, bottomRight, pointInside, pointOutside),
        calcIntersectionPoint(bottomLeft, bottomRight, pointInside, pointOutside),
        calcIntersectionPoint(topLeft, bottomLeft, pointInside, pointOutside)
    ];
    return points.filter((point) => point !== null)
        .reduce((prevClosestPoint, currentPoint) => {
            if(prevClosestPoint !== null) {
                const prevDistance = calcDistance(prevClosestPoint, pointOutside);
                const currentDistance = calcDistance(currentPoint as Point, pointOutside);
                if(currentDistance < prevDistance) {
                    return currentPoint;
                } else {
                    return prevClosestPoint;
                }
            } else {
                return currentPoint;
            }
        }, null);
}

const calcIntersectionPoint = (p1: Point, p2: Point, p3: Point, p4: Point): Point | null => {
    // https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection#Given_two_points_on_each_line
    const denominator = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);

    if(-0.00001 <= denominator && denominator < 0.00001) {
        return null;
    } else {
        const x = (
            (p1.x * p2.y - p1.y * p2.x) * (p3.x - p4.x) - (p1.x - p2.x) * (p3.x * p4.y - p3.y * p4.x)
        ) / (
            denominator
        );

        const y = (
            (p1.x * p2.y - p1.y * p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x * p4.y - p3.y * p4.x)
        ) / (
            denominator
        );

        const t = (
            (p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)
        ) / denominator;

        if(0 <= t && t <= 1) {
            return {
                x,
                y
            }
        } else {
            return null;
        }
    }
}

const calcDistance = (a: Point, b: Point): number => {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}
