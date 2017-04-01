'use strict';

import React, {Component} from 'react';
import {connect} from 'react-redux';
import Settings from '../components/Settings.jsx';
import NotificationsUnsupported from '../components/Line/NotificationsUnsupported.jsx';
import NotificationsUnsubscribeContainer from './NotificationsUnsubscribeContainer.jsx';

class SettingsContainer extends Component {
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
            return <NotificationsUnsubscribeContainer />;
        }
        return <NotificationsUnsupported />
    }

    render() {
        return (
            <Settings>
                {this.getPanel()}
            </Settings>
        );
    }
}

export default connect()(SettingsContainer);
