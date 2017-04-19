import { getLines, saveLines } from '../../db';
import { API_PATH_ALL } from '../../helpers/Api';

export const LINES_UPDATE_BEGIN = 'LINES_UPDATE_BEGIN';
export const requestLinesUpdate = () => ({
  type: LINES_UPDATE_BEGIN
});

export const LINES_FETCH_RECEIVE = 'LINES_FETCH_RECEIVE';
export const receiveLinesUpdate = data => ({
  type: LINES_FETCH_RECEIVE,
  lines: data
});

export const fetchLines = () => (dispatch) => {
  dispatch(requestLinesUpdate());
  return fetch(API_PATH_ALL)
        // return fetch('http://tubealert.co.uk.s3-website.eu-west-2.amazonaws.com/all.json')
            .then(response => response.json())
            .then((data) => {
              saveLines(data);
              dispatch(receiveLinesUpdate(data));
            });
};

export const readLines = () => (dispatch) => {
  dispatch(receiveLinesUpdate(getLines()));
  dispatch(fetchLines());
};
