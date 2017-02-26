'use strict';

import React, {PropTypes} from 'react';
import {Link} from 'react-router';

import 'scss/molecules/_card.scss';
import 'scss/molecules/_island.scss';
import 'scss/molecules/_linebox.scss';

const disruptions = line => {
    if (!line.isDisrupted) {
        return null;
    }
    return line.latestStatus.descriptions.map((description, i) => (
        <p className="g-unit" key={i}>{description}</p>
    ));
};

const Line = ({line}) => {
    const className = `g-unit island linebox linebox--${line.urlKey}`;
    return (
        <div>
            <div className={className}>
                <h1 className="page-limit">{line.name}</h1>
            </div>
            <div className="page-limit">
                <div className="grid">
                    <div className="g">
                        <div className="card">
                            <div className="card__body card--padded">
                                <h2 className="g-unit">{line.latestStatus.title}</h2>
                                {disruptions(line)}
                                {/*{% if line.isDisrupted %}*/}
                                {/*{% for description in line.latestStatus.descriptions %}*/}
                                {/*<p className="g-unit">{{ description }}</p>*/}
                                {/*{% endfor %}*/}
                                {/*{% endif %}*/}
                                {/*{% else %}*/}
                                {/*<h2>No Information</h2>*/}
                                {/*{% endif %}*/}
                            </div>
                            <div className="card__foot">
                                <p className="f card__foot-line">
                                    <strong>Last updated: </strong>
                                    <span>{line.latestStatus.updatedAt}</span></p>
                            </div>
                        </div>
                    </div>
                    <div className="g">
                        <div className="card">
                            <div className="card__body">
                                <div className={`card__intro linebox linebox--${line.urlKey}`}>
                                    <h2 className="c card__heading">Notifications</h2>
                                </div>
                                <div>
                                    <p className="card--padded" >
                                        Your browser does not support
                                        notifications. <Link to="/settings#notifications">More info</Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

Line.propTypes = {
    line: PropTypes.object.isRequired
};

export default Line;