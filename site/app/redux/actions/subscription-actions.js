'use strict';

import { SUBSCRIPTIONS, getKey, setKey } from '../../db.js';

export const SUBSCRIPTION_RECEIVE = 'SUBSCRIPTION_RECEIVE';
export const receiveSubscriptions = (line, data) => {
    return {
        type: SUBSCRIPTION_RECEIVE,
        line: line,
        subscription: data
    }
};

export const saveSubscription = (line, data) => {
    return dispatch => {
        setKey(SUBSCRIPTIONS + '-' + line, data);
        dispatch(receiveSubscriptions(line, data));
    };
};

export const readSubscriptions = (line) => {
    return dispatch => {
        getKey(SUBSCRIPTIONS + '-' + line, data => {
            dispatch(receiveSubscriptions(line, data));
        });
    }
};


