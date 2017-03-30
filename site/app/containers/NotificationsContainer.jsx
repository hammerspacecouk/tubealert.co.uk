'use strict';

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Notifications from '../components/Line/Notifications.jsx';
import NotificationsUnsupported from '../components/Line/NotificationsUnsupported.jsx';
import NotificationsPanelContainer from './NotificationsPanelContainer.jsx';

class NotificationsContainer extends Component {
    static propTypes() {
        return {
            line: PropTypes.array.isRequired
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            supported: false
        }
    }

    componentDidMount() {
        if (typeof window !== 'undefined' &&
            'navigator' in window &&
            'serviceWorker' in window.navigator &&
            'PushManager' in window
        ) {
            this.setState({
                supported: true
            });
        }
    }

    getPanel() {
        if (this.state.supported) {
            return <NotificationsPanelContainer line={this.props.line} />;
        }
        return <NotificationsUnsupported />
    }

    render() {
        return (
            <Notifications line={this.props.line}>
                {this.getPanel()}
            </Notifications>
        );
    }
}

export default connect(
    (state, props) => ({
        line: props.line
    })
)(NotificationsContainer);
