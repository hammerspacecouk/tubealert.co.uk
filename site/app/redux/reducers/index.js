'use strict';

import { combineReducers } from 'redux';
import linesReducer from './lines-reducer';
import subscriptionsReducer from './subscriptions-reducer';

// Combine Reducers
const reducers = combineReducers({
    linesState: linesReducer,
    subscriptionsState: subscriptionsReducer,
});

export default reducers;