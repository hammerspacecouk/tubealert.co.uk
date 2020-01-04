import * as LineActions from "../actions/line-actions";

const initialState = {
  lines: [],
  isFetching: false,
};

const linesReducer = (state = initialState, action) => {
  switch (action.type) {
    case LineActions.LINES_UPDATE_BEGIN: {
      return { ...state, isFetching: true };
    }
    case LineActions.LINES_FETCH_RECEIVE: {
      let lines = action.lines;
      if (!lines || !lines[0]) {
        // data was not successfully fetched. no change
        return { ...state, isFetching: false };
      }

      // only update lines data if it is newer
      if (state.lines[0]) {
        const originalDate = new Date(state.lines[0].updatedAt);
        const newDate = new Date(lines[0].updatedAt);
        if (newDate < originalDate) {
          lines = state.lines;
        }
      }
      return { ...state, lines, isFetching: false };
    }
    default:
      return state;
  }
};

export const getLine = lineKey => this.state.filter(line => line.urlKey === lineKey);

export default linesReducer;
