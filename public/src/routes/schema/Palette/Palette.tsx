import * as _ from "lodash";
import {NodeShape} from "../../../schema/NodeShape";
import TrainerNodeWidget from "../../../schema/widgets/TrainerNodeWidget/TrainerNodeWidget";
import {LinkDirectionality} from "../../../schema/LinkDirectionality";
import * as React from "react";
import {LinkLine} from "../../../schema/LinkLine";
import ArrowedLink from "../../../components/ArrowedLink/ArrowedLink";
import {LinkPaletteValue} from "../LinkPaletteValue";
import {NodePaletteValue} from "../NodePaletteValue";
import styles from './Palette.scss';
import NodeDragAndDropDataProvider from "../NodeDragAndDropPropertiesProvider";
import {Size} from "../../../types/Size";

const NODE_ITEM_SIZE_MAX: Size = {
    width: 125,
    height: 75
}

interface Props {
    nodeOptions: NodePaletteValue[],
    linkOptions: LinkPaletteValue[],
    link: LinkPaletteValue | null,
    onChangeLink: (value: LinkPaletteValue) => void,
}

const Palette = (props: Props) => {
    return (
        <div styleName="palette">
            <div styleName="palette__shapes">
                {props.nodeOptions.map((node) => {
                    const nodeSize = {width: node.width, height: node.height};
                    const onDragStart: React.DragEventHandler = (e) => {
                        NodeDragAndDropDataProvider.putNodeDataToDataTransfer(e.dataTransfer, node);
                    };
                    return (
                        <NodesPaletteItem
                            key={node.shape + '' + node.text}
                            text={node.text}
                            scale={calculateNodeScalingFactor(NODE_ITEM_SIZE_MAX, nodeSize)}
                            onDragStart={onDragStart}>
                            <TrainerNodeWidget
                                shape={node.shape}
                                text={node.text}
                                ports={[]}
                                diagramScale={1}
                                size={nodeSize}
                                isSelected={false}
                            />
                        </NodesPaletteItem>
                    )
                })}
            </div>
            <div styleName="palette__links">
                {props.linkOptions.map((option, idx) => (
                    <LinksPaletteItem
                        key={idx}
                        value={option}
                        isSelected={_.eq(props.link, option)}
                        onClick={props.onChangeLink}
                    />
                ))}
            </div>
        </div>
    )
};

export default Palette;

const calculateNodeScalingFactor = (maxSize: Size, nodeSize: Size): number => {
    if(nodeSize.width < maxSize.width && nodeSize.height < maxSize.height) {
        return 1;
    } else {
        return 1 / Math.max(nodeSize.width / maxSize.width, nodeSize.height / maxSize.height);
    }
}

const NodesPaletteItem = (props: {text: string, scale: number, children: JSX.Element[] | JSX.Element, onDragStart: React.DragEventHandler}) => (
    <div styleName="palette__shapes-item">
        <div draggable
             title={props.text}
             styleName="palette__shapes-item-wrapper"
             style={{transform: `scale(${props.scale})`}}
             onDragStart={props.onDragStart}>
            {props.children}
        </div>
    </div>
);

const LinksPaletteItem = (props: {value: LinkPaletteValue, isSelected: boolean, onClick: (value: LinkPaletteValue) => void}) => (
    <div styleName="palette__links-item"
         className={props.isSelected ? styles['palette__links-item--selected'] : ''}
         onClick={() => props.onClick(props.value)}>
        <svg styleName="palette__links-item-svg" viewBox="0 0 300 20" xmlns="http://www.w3.org/2000/svg">
            <ArrowedLink
                width={1}
                isSelected={false}
                line={props.value.line}
                directionality={props.value.directionality}
                text={props.value.text}
                start={{x: 10, y: 10}}
                end={{x: 290, y: 10}}
            />
        </svg>
    </div>
);
