'use strict';

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

class NotificationsPanelContainer extends Component {
    static propTypes() {
        return {
            line: PropTypes.array.isRequired
        }
    }

    componentDidMount() {

    }

    render() {
        return (
            <div>
                THIS IS TO BE THE DATE PANEL (TO BE ABSTRACTED)
            </div>
        );
    }
}

export default connect(
    (state, props) => ({
        line: props.line
    })
)(NotificationsPanelContainer);
