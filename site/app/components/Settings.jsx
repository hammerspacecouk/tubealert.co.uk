'use strict';

import React, {PropTypes} from 'react';

const Settings = ({children}) => (
    <div>
        <h1 className="g-unit linebox card card--padded">Settings & Information</h1>
        <div className="page-limit">
            <div className="g-unit card">
                {children}
            </div>
            <div className="g-unit card card--padded">
                <h2>About</h2>
                <p>Powered by TfL Open Data. Built by <a href="https://www.hammerspace.co.uk">Hammerspace</a></p>
            </div>
        </div>
    </div>
);

Settings.propTypes = {
    children: PropTypes.object.isRequired
};

export default Settings;