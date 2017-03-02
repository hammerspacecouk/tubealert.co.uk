'use strict';

import React, {PropTypes} from 'react';
import Disruptions from './Line/Disruptions.jsx';
// import NotificationsContainer from '../containers/NotificationsContainer.jsx';

import 'scss/molecules/_island.scss';
import 'scss/molecules/_linebox.scss';

const Line = ({line}) => {
    const className = `g-unit island linebox linebox--${line.urlKey}`;
    return (
        <div>
            <div className={className}>
                <h1 className="page-limit">{line.name}</h1>
            </div>
            <div className="page-limit">
                <Disruptions line={line} />
            </div>
        </div>
    );
};

Line.propTypes = {
    line: PropTypes.object.isRequired
};

export default Line;

/*<div className="grid">
 <div className="g 3/5@xxl 2/3@xxxl">
 <Disruptions line={line} />
 </div>
 <div className="g 2/5@xxl 1/3@xxxl">
 <NotificationsContainer line={line} />
 </div>
 <div className="g">
 <div className="card card--padded">
 <h2 className="c card__heading g-unit">History</h2>
 <div>
 To do
 </div>
 </div>
 </div>
 </div>*/
