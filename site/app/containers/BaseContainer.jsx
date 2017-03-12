'use strict';

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Layout from '../components/Layout.jsx';
import store from '../store';
import {fetchLines} from '../redux/actions/line-actions';
import Index from '../components/Index.jsx';
import Settings from '../components/Settings.jsx';
import LineContainer from '../containers/LineContainer.jsx';

class BaseContainer extends Component {
    static propTypes() {
        return {
            lines: PropTypes.array.isRequired
        }
    }

    constructor(props) {
        super(props);
        this.allowPolling = (typeof window !== 'undefined');
    }

    componentWillReceiveProps(nextProps) {
        if (this.props === nextProps ||
            !this.allowPolling
        ) {
            return;
        }
        window.clearTimeout(this.timeout);
        this.timeout = window.setTimeout(() => store.dispatch(fetchLines()), 1000*60*2); // poll every two minutes
    }

    render() {
        const routes = [
            {path : "/", exact: true, component: () => <Index />},
            {path : "/settings", exact: false, component: () => <Settings />},
            {path : "/:lineKey", exact: false, component: () => <LineContainer />},
        ];
        return (
            <Layout lines={this.props.lines} routes={routes} />
        );
    }
}

export default connect(
    store => ({
        lines: store.linesState.lines
    })
)(BaseContainer);
