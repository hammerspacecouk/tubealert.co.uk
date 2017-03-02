'use strict';

import React, {PropTypes} from 'react';

const leftPad = (num) => {
    let str = num.toString();
    if (str.length < 2) {
        str = '0' + str;
    }
    return str;
};

const DateTime = ({date}) => (
    <time dateTime={date.toISOString()}>
        {leftPad(date.getHours())}:{leftPad(date.getMinutes()) + ' '}
        {leftPad(date.getDate())}/{leftPad(date.getMonth()+1)}/{leftPad(date.getFullYear())}
    </time>
);

DateTime.propTypes = {
    date: PropTypes.object.isRequired
};

export default DateTime;
