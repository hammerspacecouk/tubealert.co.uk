'use strict';

import { ALL_LINES, getKey, setKey } from '../../db.js';

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

export const readLines = () => {
    return dispatch => {
        // todo - fetch the data from the embedded script (use whichever is newest)
        // try to fetch the data from the indexdb database
        getKey(ALL_LINES, data => {
            dispatch(receiveLinesUpdate(data));
        });
        dispatch(fetchLines());
    }
};

export const fetchLines = () => {
    return dispatch => {
        dispatch(requestLinesUpdate());
        return fetch('/all.json')
        // return fetch('http://tubealert.co.uk.s3-website.eu-west-2.amazonaws.com/all.json')
            .then(response => response.json())
            .then(data => {
                setKey(ALL_LINES, data);
                dispatch(receiveLinesUpdate(data))
            });
    };
};
