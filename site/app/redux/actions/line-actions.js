'use strict';

export const LINES_UPDATE_BEGIN = 'LINES_UPDATE_BEGIN';
export const requestLinesUpdate = () => {
    return {
        type: LINES_UPDATE_BEGIN
    };
};

export const LINES_FETCH_RECEIVE = 'LINES_FETCH_RECEIVE';
export const receiveLinesUpdate = (data) => {
    return {
        type: LINES_FETCH_RECEIVE,
        lines: data
    }
};

export const fetchLines = () => {
    return dispatch => {
        dispatch(requestLinesUpdate());
        return fetch('/all.json')
        // return fetch('http://tubealert.co.uk.s3-website.eu-west-2.amazonaws.com/all.json')
            .then(response => response.json())
            .then(data => dispatch(receiveLinesUpdate(data)));
    };
};
