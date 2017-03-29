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
            // only update lines data if it is newer
            let lines = action.lines;
            if (lines[0] && state.lines[0]) {
                const originalDate = new Date(state.lines[0].updatedAt);
                const newDate = new Date(lines[0].updatedAt);
                if (newDate < originalDate) {
                    lines = state.lines;
                }
            }
            return {...state, lines: lines, isFetching: false};
        }
        // case LineActions.LINES_FETCH_ERROR: {
        //     return { ...state, isFetching: false };
        // }
    }
    return state;
};

export const getLine = (lineKey) => this.state.filter((line) => (line.urlKey == lineKey));

export default linesReducer;