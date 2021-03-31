import * as React from 'react';
import {NodeModel} from "storm-react-diagrams";
import {library} from '@fortawesome/fontawesome-svg-core';
import {faArrowAltCircleRight} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import styles from './TrainerPortWidget.scss';

library.add(faArrowAltCircleRight);

interface Props {
    name: string,
    node: NodeModel,
    visible: boolean
}

const TrainerPortWidget = (props: Props) => {
    return (
        <div
            className="port"
            styleName={`port ${props.visible ? ' port--visible' : ''}`}
            data-name={props.name}
            data-nodeid={props.node.getID()}>
            <FontAwesomeIcon
                className={styles['port__icon']}
                icon={faArrowAltCircleRight}
            />
        </div>
    )
}

export default TrainerPortWidget;
