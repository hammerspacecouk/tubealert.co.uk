import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { API_PATH_UNSUBSCRIBE } from '../helpers/Api';
import { unsubscribe } from '../redux/actions/subscription-actions';

class NotificationsContainer extends Component {
  static propTypes() {
    return {
      dispatch: PropTypes.object.isRequired
    };
  }

  constructor() {
    super();
    this.state = {
      isLoading: false,
      statusText: null
    };
    this.onUnsubscribe.bind(this);
  }

  onUnsubscribe() {
    this.setState({
      isLoading: true,
      statusText: 'Saving... '
    });

    window.navigator.serviceWorker.ready
            .then(
                serviceWorkerRegistration => serviceWorkerRegistration.pushManager.getSubscription()
            )
            .then((subscription) => {
              const postData = {
                userID: subscription.endpoint
              };
              return fetch(API_PATH_UNSUBSCRIBE, {
                method: 'post',
                body: JSON.stringify(postData)
              });
            })
            .then(response => response.json())
            .then(() => {
              this.props.dispatch(unsubscribe());
              this.setState({
                isLoading: false,
                statusText: 'Successfully unsubscribed '
              });
            })
            .catch(() => {
              this.setState({
                isLoading: false,
                statusText: 'An error occurred '
              });
            });
  }

  render() {
    const loading = (this.state.isLoading) ? (<span className="loading loading--leading" />) : null;

    return (
      <div>
        <div className="card--padded">
          <h2 id="notifications">Notifications</h2>
          <p>
            You can delete all of your subscriptions here.
            You will no longer receive notifications.
          </p>
        </div>
        <div className="card__foot f text--right">
          {loading}
          {this.state.statusText}
          <button
            onClick={this.onUnsubscribe}
            className="btn"
          >Delete all subscriptions</button>
        </div>
      </div>
    );
  }
}

export default connect()(NotificationsContainer);

