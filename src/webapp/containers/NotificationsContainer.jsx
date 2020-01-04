import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Notifications from "../components/Line/Notifications.jsx";
import NotificationsUnsupported from "../components/Line/NotificationsUnsupported.jsx";
import NotificationsPanelContainer from "./NotificationsPanelContainer.jsx";

class NotificationsContainer extends Component {
  static propTypes() {
    return {
      line: PropTypes.array.isRequired,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      supported: false,
    };
  }

  componentDidMount() {
    this.checkSupport();
  }

  getPanel() {
    if (this.state.supported) {
      return <NotificationsPanelContainer line={this.props.line} />;
    }
    return <NotificationsUnsupported />;
  }

  checkSupport() {
    if (
      typeof window !== "undefined" &&
      "navigator" in window &&
      "serviceWorker" in window.navigator &&
      "PushManager" in window
    ) {
      this.setState({
        supported: true,
      });
    }
  }

  render() {
    return <Notifications line={this.props.line}>{this.getPanel()}</Notifications>;
  }
}

export default connect((state, props) => ({
  line: props.line,
}))(NotificationsContainer);
