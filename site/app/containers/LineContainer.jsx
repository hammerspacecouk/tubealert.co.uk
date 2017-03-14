'use strict';

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Line from '../components/Line.jsx';

class LineContainer extends Component {
    static propTypes() {
        return {
            line: PropTypes.array
        }
    }

    render() {
        console.log(this.props.line);
        if (!this.props.line) {
            return null;
        }
        return (
            <Line line={this.props.line} />
        );
    }
}

export default connect(
    (state, props) => ({
        line: state.linesState.lines.find(line => line.urlKey === props.match.params.lineKey)
    })
)(LineContainer);
