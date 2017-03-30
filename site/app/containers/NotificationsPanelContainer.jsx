'use strict';

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {base64UrlToUint8Array} from '../helpers/Encoding';

class NotificationsPanelContainer extends Component {
    static propTypes() {
        return {
            line: PropTypes.array.isRequired
        }
    }

    onSave() {
        const swOptions = {
            userVisibleOnly: true,
            applicationServerKey: base64UrlToUint8Array(
                'BKSO9McPgFJ6DcngM1wB2hxI_rnLoPs_JhyRh8bFJw6BBX-QFxGKYnTSVtyLu4G3Vc3jihaDUIZWiaYqEtvs_dg'
            )
        };

        window.navigator.serviceWorker.ready
            .then(
                serviceWorkerRegistration => serviceWorkerRegistration.pushManager.subscribe(swOptions)
            )
            .then(subscription => {
                console.log(JSON.stringify(subscription));
                const postData = {
                    userID : subscription.endpoint,
                    lineID : this.props.line.urlKey,
                    timeSlots : [
                        [true,false,true,true],
                        [false,true]
                    ],
                    subscription: subscription
                };
                return fetch('https://mdw7494b70.execute-api.eu-west-2.amazonaws.com/prod/subscribe', {
                    method: 'post',
                    body: JSON.stringify(postData)
                });
            })
            .then(response => response.json())
            .then(data => {
                // todo - update the status (save in redux)
                console.log(data);
            })
            .catch(err => {
                console.log('why');
                console.log(err)
            });
    }

    render() {
        return (
            <div>
                THIS IS TO BE THE DATE PANEL (TO BE ABSTRACTED)

                <button onClick={this.onSave.bind(this)}>Save</button>
            </div>
        );
    }
}

export default connect(
    (state, props) => ({
        line: props.line
    })
)(NotificationsPanelContainer);
