import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import DateTime from "../components/Helpers/DateTime.jsx";

class OutOfDateWarningContainer extends Component {
  static propTypes() {
    return {
      lines: PropTypes.array.isRequired,
      isFetching: PropTypes.boolean.isRequired,
    };
  }

  getLatestDate() {
    const lines = this.props.lines;
    if (lines[0]) {
      return new Date(lines[0].latestStatus.updatedAt);
    }
    return null;
  }

  isOutOfDate() {
    const date = this.getLatestDate();
    const now = new Date();
    const halfHourAgo = now - 1000 * 60 * 30;
    return date && date < halfHourAgo;
  }

  render() {
    if (!this.isOutOfDate()) {
      return null;
    }
    let fetching = null;
    if (this.props.isFetching) {
      fetching = <span className="pull-right loading loading--invert" />;
    }

    return (
      <div className="out-of-date">
        {fetching}
        Last Updated: <DateTime date={this.getLatestDate()} />
      </div>
    );
  }
}

export default connect(store => ({
  lines: store.linesState.lines,
  isFetching: store.linesState.isFetching,
}))(OutOfDateWarningContainer);
