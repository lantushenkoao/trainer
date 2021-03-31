import * as React from 'react';
import './TrainerNodeWidget.scss';
import {NodeShape} from "../../NodeShape";
import {PortModel} from "storm-react-diagrams";
import * as _ from "lodash";
import {Point} from "../../../types/Point";
import TrainerPortWidget from "../TrainerPortWidget/TrainerPortWidget";
import {Size} from "../../../types/Size";

interface Props {
    shape: NodeShape,
    text: string,
    ports: PortModel[],
    size: Size,
    isSelected: boolean,
    diagramScale: number,
    onTextChange?: (text: string) => void,
    onDimensionsChange?: (size: Size) => void
}

interface State {
    isEditing: boolean,
    isResizing: boolean,
    isHovered: boolean,
    initialPosition: Point | null,
    initialSize: Size | null,
    lastPosition: Point | null
}

export default class TrainerNodeWidget extends React.Component<Props, State> {

    private textContainer: HTMLElement | null;
    private resizeHandle: SVGElement | null;

    state: State = {
        isEditing: false,
        isResizing: false,
        isHovered: false,
        initialPosition: null,
        initialSize: null,
        lastPosition: null
    }

    documentListeners: {[key: string]: (e: MouseEvent) => void}

    constructor(props: Props) {
        super(props);
        this.documentListeners = {
            mousedown: this.handleDocumentMouseDown,
            mouseup: this.handleDocumentMouseUp,
            mousemove: this.handleDocumentMouseMove,
            click: this.handleDocumentMouseClick
        }
    }

    componentDidMount() {
        _.forEach(this.documentListeners, (listener, eventType) => window.document.addEventListener(eventType, listener));
        this._updateNodeText('');
    }

    componentWillUnmount() {
        _.forEach(this.documentListeners, (listener, eventType) => window.document.removeEventListener(eventType, listener));
    }

    componentDidUpdate(prevProps: Props) {
        this._updateNodeText(prevProps.text);
    }

    _updateNodeText(prevText: string) {
        if(this.textContainer !== null && this.props.text !== prevText) {
            this.textContainer.innerHTML = this.props.text;
        }
    }

    private selectTextInElement(element: Element) {
        const range = window.document.createRange();
        range.setStart(element, 0);
        range.setEnd(element, element.childElementCount > 0 ? 1 : 0);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        window.document.execCommand('selectAll');
    }

    private finishTextEditing() {
        this.setState({isEditing: false});
        this.props.onTextChange!!(this.textContainer!!.innerHTML);
    }

    private handleDoubleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
        if(this.canBeEditable()) {
            this.setState({isEditing: true}, () => {
                this.selectTextInElement(this.textContainer!!);
            });
        }
    };

    private handleKeyDown: React.KeyboardEventHandler = (e) => {
        if(!e.shiftKey && e.key === 'Enter' && this.state.isEditing) {
            this.finishTextEditing();
        }
    }

    private handleDocumentMouseClick = (e: MouseEvent) => {
        if(this.state.isEditing && e.target !== this.textContainer) {
            this.finishTextEditing();
        }
    }

    private handleDocumentMouseDown = (e: MouseEvent) => {
        if(e.target === this.resizeHandle) {
            const position = {
                x: e.clientX,
                y: e.clientY
            };
            this.setState({
                isResizing: true,
                initialPosition: position,
                initialSize: this.props.size,
                lastPosition: position
            });
        }
    }

    private handleDocumentMouseUp = (e: MouseEvent) => {
        if(this.state.isResizing) {
            const {onDimensionsChange} = this.props;
            if(onDimensionsChange) {
                onDimensionsChange(this.resolveSize());
            }
            this.setState({isResizing: false, initialPosition: null, initialSize: null, lastPosition: null});
        }
    }

    private handleDocumentMouseMove = (e: MouseEvent) => {
        if(this.state.isResizing) {
            const {clientX, clientY} = e;
            this.setState({lastPosition: {x: clientX, y: clientY}});
        }
    }

    private handleMouseEnter: React.MouseEventHandler = (e) => {
        this.setState({isHovered: true});
    }

    private handleMouseLeave: React.MouseEventHandler = (e) => {
        this.setState({isHovered: false});
    }

    private canBeEditable() {
        return this.props.onTextChange !== undefined;
    }

    private canBeResized() {
        return this.props.onDimensionsChange !== undefined;
    }

    private resolveSize(): Size {
        if(this.state.isResizing) {
            const {diagramScale} = this.props;
            const {initialPosition, initialSize, lastPosition} = this.state;

            const calculatedWidth = initialSize!!.width + (lastPosition!!.x - initialPosition!!.x) / diagramScale;
            const calculatedHeight = initialSize!!.height + (lastPosition!!.y - initialPosition!!.y) / diagramScale;

            const minimumSize = 50;

            return {
                width: Math.max(minimumSize, calculatedWidth),
                height: Math.max(minimumSize, calculatedHeight)
            }
        } else {
            return this.props.size;
        }
    }

    render() {
        const {text, isSelected, shape, ports} = this.props;
        const {isEditing, isHovered} = this.state;
        const size = this.resolveSize();
        return (
            <div styleName={`node node--${shape}`}
                style={{width: `${size.width}px`, height: `${size.height}px`}}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                onDoubleClick={this.handleDoubleClick}>
                {ports.map((port) => (
                    <div key={port.id} styleName={`node__port-container ${isEditing ? 'node__port-container--editing' : ''}`}>
                        <TrainerPortWidget
                            visible={isHovered && !isEditing}
                            name={port.name}
                            node={port.getParent()}
                        />
                    </div>
                ))}
                <svg styleName="node__shape-container"
                     preserveAspectRatio={'none'}
                     xmlns="http://www.w3.org/2000/svg">
                    <g transform="translate(2, 2)">
                        {SHAPE_PATHS[shape](size)}
                    </g>
                </svg>
                <svg styleName="node__box-container"
                     preserveAspectRatio={'none'}
                     xmlns="http://www.w3.org/2000/svg">
                    {isSelected && (
                        <g transform="translate(4, 4)">
                            <rect
                                styleName="node__box"
                                x={0}
                                y={0}
                                width={size.width}
                                height={size.height}
                            />
                            {this.canBeResized() && (
                                <rect
                                    styleName="node__box-corner"
                                    x={size.width - 4}
                                    y={size.height - 4}
                                    width="8"
                                    height="8"
                                    ref={(elem) => this.resizeHandle = elem}
                                    onMouseDown={(e) => e.stopPropagation()}
                                />
                            )}
                        </g>
                    )}
                </svg>
                <div
                    styleName={`node__label ${(!isEditing && this.canBeEditable() && _.isEmpty(text)) ? 'node__label--empty' : ''}`}
                    contentEditable={isEditing}
                    ref={(elem) => this.textContainer = elem}
                    onKeyDown={this.handleKeyDown}
                />
            </div>
        );
    }
}

const RectShape = (size: Size) => (
    <rect
        styleName="node__shape"
        x={0}
        y={0}
        width={size.width - 4}
        height={size.height - 4}
    />
);

const SHAPE_PATHS: {[key: string]: (size: Size) => JSX.Element} = {
    [NodeShape.SQUARE_RECT]: RectShape,
    [NodeShape.ROUND_RECT]: (size) => React.cloneElement(RectShape(size), {rx: size.height / 2, ry: "50%"}),
    [NodeShape.RHOMBUS]: (size) => (
        <polygon
            styleName="node__shape"
            points={scalePoints([[2,48], [48,2], [96,48], [48,96]], size)}

        />
    ),
    [NodeShape.ROUND]: ({width, height}) => {
        return (
            <g transform="translate(-2, -2)">
                <ellipse
                    styleName="node__shape"
                    cx={width / 2}
                    cy={height / 2}
                    rx={width / 2 - 4}
                    ry={height / 2 - 4}
                />
            </g>
        )
    },
    [NodeShape.PARALLELOGRAM]: (size) => (
        <polygon
            styleName="node__shape"
            points={scalePoints([[22, 2], [96, 2], [76, 96], [2, 96]], size)}
        />
    ),
    [NodeShape.DOCUMENT]: (size) => (
        <path
            styleName="node__shape"
            d={[
                'M ' + scalePoints([[2,80]], size),
                'L ' + scalePoints([[2,2]], size),
                'L ' + scalePoints([[98,2]], size),
                'L ' + scalePoints([[98,80]], size),
                'C ' + scalePoints([[42,42], [42,122], [2,80]], size)
            ].join(' ')}
        />
    ),
    [NodeShape.TRIANGLE]: (size) => (
        <polygon
            styleName="node__shape"
            points={scalePoints([[0, 0], [98, 50], [0, 98]], size)}
        />
    ),
    [NodeShape.PENTAGON]: (size) => (
        <polygon
            styleName="node__shape"
            points={scalePoints([[0, 40], [48, 0], [96, 40], [73, 96], [24, 96]], size)}
        />
    ),
    [NodeShape.CARD]: (size) => (
        <polygon
            styleName="node__shape"
            points={scalePoints([[0, 15], [15, 0], [98, 0], [98, 98], [0, 98]], size)}
        />
    ),
    [NodeShape.TRAPEZOID]: (size) => (
        <polygon
            styleName="node__shape"
            points={scalePoints([[22, 2], [74,  2], [96, 96], [2, 96]], size)}
        />
    )
};

const scalePoints = (relativePoints: [number, number][], size: Size) =>
    relativePoints
        .map(([kX, kY]) => `${(kX / 100) * size.width},${(kY / 100) * size.height}`)
        .join(' ');
