'use strict';

import * as SubscriptionActions from '../actions/subscription-actions';

const initialState = {
};

const subscriptionsReducer = (state = initialState, action) => {
    switch(action.type) {
        case SubscriptionActions.SUBSCRIPTION_RECEIVE: {
            const newState = {...state};
            newState['SUBSCRIPTION-' + action.line] = action.subscription;
            return newState;
        }
    }
    return state;
};

export default subscriptionsReducer;
