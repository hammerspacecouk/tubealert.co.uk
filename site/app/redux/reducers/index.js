'use strict';

import { combineReducers } from 'redux';
import linesReducer from './lines-reducer';

// Combine Reducers
const reducers = combineReducers({
    linesState: linesReducer
});

export default reducers;