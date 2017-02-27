'use strict';

import React, {PropTypes} from 'react';

import 'scss/molecules/_card.scss';

const disruptions = line => {
    if (!line.isDisrupted) {
        return null;
    }
    return line.latestStatus.descriptions.map((description, i) => (
        <p className="g-unit" key={i}>{description}</p>
    ));
};

const Line = ({line}) => {
    return (
        <div className="card">
            <div className="card__body card--padded">
                <h2 className="g-unit">{line.latestStatus.title}</h2>
                {disruptions(line)}
            </div>
            <div className="card__foot">
                <p className="f card__foot-line">
                    <strong>Last updated: </strong>
                    <span>{line.latestStatus.updatedAt}</span></p>
            </div>
        </div>
    );
};

Line.propTypes = {
    line: PropTypes.object.isRequired
};

export default Line;