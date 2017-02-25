'use strict';

import React, {PropTypes} from 'react';

const Line = ({line}) => {
    const className = `linebox linebox--${line.urlKey}`;
    return (
        <div>
            <h1 className={className}>{line.name}</h1>
        </div>
    );
};

Line.propTypes = {
    line: PropTypes.object.isRequired
};

export default Line;