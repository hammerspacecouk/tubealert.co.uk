'use strict';

import React from 'react';

const Settings = () => (
    <div>
        <h1 className="g-unit linebox card card--padded">Settings &amp; Information</h1>
        <div className="page-limit">
            <div className="g-unit card">
                <div data-js="notifications-settings">
                    <div>
                        <div className="card--padded">
                            <h2 id="notifications">Notifications</h2>
                            <p>You can delete all of your subscriptions here. You will no longer receive notifications.</p>
                        </div>
                        <div className="card__foot">
                            <p className="f">
                                <button className="btn" data-js="notifications-delete">Delete all subscriptions</button>
                                <span className="card__foot-line" data-js="notifications-progress"></span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="g-unit card card--padded">
                <h2>About</h2>
                <p>Powered by TfL Open Data</p>
            </div>
        </div>
    </div>
);

export default Settings;