'use strict';

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import OutOfDateWarningContainer from './OutOfDateWarningContainer.jsx';
import Layout from '../components/Layout.jsx';
import store from '../store';
import {fetchLines} from '../redux/actions/line-actions';

class BaseContainer extends Component {
    static propTypes() {
        return {
            routes: PropTypes.array.isRequired,
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
        let appClass = 'app';
        if (this.props.routes[this.props.routes.length - 1]) {
            const name = this.props.routes[this.props.routes.length - 1].name;
            appClass += ' app--' + name;
        }
        return (
            <Layout lines={this.props.lines}
                    appClass={appClass}
                    innerChildren={this.props.children}
                    warningMessage={<OutOfDateWarningContainer />}
            />
        );
    }
}

export default connect(
    store => ({
        lines: store.linesState.lines
    })
)(BaseContainer);
