import * as React from 'react';
import './ContentLayout.scss';
import { ReactNode } from 'react';
import * as _ from 'lodash';

interface LayoutWithLeftBarProps {
    leftBarContent?: string | JSX.Element;
    leftBarNoPadding?: boolean;
    contentNoPadding?: boolean;
    scrollableContent?: boolean;
    children: ReactNode
}

const ContentLayout = (props: LayoutWithLeftBarProps) => {

    const getPaddingStyleName = () => props.contentNoPadding ? '' : ' content-padding';
    const isContentScrollable = () => _.isUndefined(props.scrollableContent) || props.scrollableContent;

    return (
        <div className="content" styleName="layout">
            {props.leftBarContent &&
            <div className="content"
                 styleName={'layout__left-bar' + (!props.leftBarNoPadding ? ' layout__left-bar--padding' : '')}>
                {typeof props.leftBarContent == 'string'
                    ? <h1>{props.leftBarContent}</h1>
                    : props.leftBarContent
                }
            </div>
            }
            <div className="content"
                 styleName={'layout__content' + (isContentScrollable() ? getPaddingStyleName() : '')}>
                {isContentScrollable()
                    ? <div className="scrollbar-wrapper" styleName={getPaddingStyleName()}>{props.children}</div>
                    : props.children
                }
            </div>
        </div>
    );
};

export default ContentLayout;