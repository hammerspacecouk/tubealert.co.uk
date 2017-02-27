'use strict';

import React, {PropTypes} from 'react';
import Alert from '../Icons/Alert.jsx';

import 'scss/molecules/_card.scss';

const Line = ({line, children}) => {
    return (
        <div className="card">
            <div className="card__body">
                <div className={`card__intro linebox linebox--${line.urlKey}`}>
                    <h2 className="c card__heading">Notifications</h2>
                    <div className="card__logo"><Alert /></div>
                </div>
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
};

Line.propTypes = {
    line: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired
};

export default Line;