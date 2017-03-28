'use strict';

import React from 'react';
import Alert from './Icons/Alert.jsx';

const Index = () => (
    <div>
        <h1 className="g-unit invisible">TubeAlert</h1>
        <div className="page-limit">
            <div className="intro-icon">
                <Alert />
            </div>
            <div className="text--center card card--padded">
                Choose a line for more detailed information, and to setup alerts for disruptions.
            </div>
        </div>
    </div>
);

export default Index;
