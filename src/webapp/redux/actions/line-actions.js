import { getLines, saveLines } from "../../db";
import { API_PATH_ALL } from "../../helpers/Api";

export const LINES_UPDATE_BEGIN = "LINES_UPDATE_BEGIN";
export const requestLinesUpdate = () => ({
  type: LINES_UPDATE_BEGIN,
});

export const LINES_FETCH_RECEIVE = "LINES_FETCH_RECEIVE";
export const receiveLinesUpdate = data => ({
  type: LINES_FETCH_RECEIVE,
  lines: data,
});

export const fetchLines = () => dispatch => {
  dispatch(requestLinesUpdate());
  return fetch(API_PATH_ALL)
    .then(response => response.json())
    .then(data => {
      saveLines(data);
      dispatch(receiveLinesUpdate(data));
    })
    .catch(() => {
      dispatch(receiveLinesUpdate(null));
    });
};

export const readLines = () => dispatch => {
  dispatch(receiveLinesUpdate(getLines()));
  dispatch(fetchLines());
};

export const setLines = data => dispatch => {
  saveLines(data);
  dispatch(receiveLinesUpdate(data));
};
