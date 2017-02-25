'use strict';

import * as LineActions from '../actions/line-actions';

const initialState = {
    lines: [],
    isFetching: false
};

const linesReducer = (state = initialState, action) => {
    switch(action.type) {
        case LineActions.LINES_UPDATE_BEGIN: {
            return { ...state, isFetching: true };
        }
        case LineActions.LINES_FETCH_RECEIVE: {
            return {...state, lines: action.lines, isFetching: false};
        }
        // case LineActions.LINES_FETCH_ERROR: {
        //     return { ...state, isFetching: false };
        // }
    }
    return state;
};

export const getLine = (lineKey) => this.state.filter((line) => (line.urlKey == lineKey));

export default linesReducer;