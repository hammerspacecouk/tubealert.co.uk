'use strict';

import { saveLineSubscription, getLineSubscription, deleteAllSubscriptions } from '../../db.js';

export const SUBSCRIPTION_RECEIVE = 'SUBSCRIPTION_RECEIVE';
export const receiveSubscriptions = (lineID, data) => {
    return {
        type: SUBSCRIPTION_RECEIVE,
        line: lineID,
        subscription: data
    }
};

export const saveSubscription = (lineID, data) => {
    return dispatch => {
        saveLineSubscription(lineID, data);
        dispatch(receiveSubscriptions(lineID, data));
    };
};

export const readSubscriptions = (lineID) => {
    return dispatch => {
        dispatch(receiveSubscriptions(lineID, getLineSubscription(lineID)));
    }
};

export const unsubscribe = () => deleteAllSubscriptions;


