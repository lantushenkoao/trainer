import * as React from 'react';

import './LinkArrow.scss';

interface LinkArrowProps {
    width: number;
}

const LinkArrow = (props: LinkArrowProps) => (
    <path
        styleName="arrow"
        strokeWidth={1}
        d="M 10 20 L 20 20 L 15 0 Z"
    />
);

export default LinkArrow;
