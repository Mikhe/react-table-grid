import * as React from 'react';

export default class CollapseButton extends React.PureComponent {
    render() {
        const classCollapsed = this.props.collapsed ? 'collapsed' : '';
        return <button
                className={`collapse-button empty ${classCollapsed}`}
                onClick={() => {
                    this.props.onClick();
                }}>
                    &#17;
            </button>
    }
}