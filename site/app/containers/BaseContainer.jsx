'use strict';

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Layout from '../components/Layout.jsx';
import store from '../store';
import {fetchLines} from '../redux/actions/line-actions';

class BaseContainer extends Component {
    static propTypes() {
        return {
            children: PropTypes.element.isRequired,
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
        return (<Layout lines={this.props.lines} innerChildren={this.props.children} />);
    }
}

export default connect(
    store => ({
        lines: store.linesState.lines
    })
)(BaseContainer);
