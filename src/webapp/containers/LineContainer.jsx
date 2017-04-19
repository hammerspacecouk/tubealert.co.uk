import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Line from '../components/Line.jsx';

class LineContainer extends Component {
  static propTypes() {
    return {
      line: PropTypes.array.isRequired
    };
  }

  render() {
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
      line: state.linesState.lines.find(line => line.urlKey === props.params.lineKey)
    })
)(LineContainer);
