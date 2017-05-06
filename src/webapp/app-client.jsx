import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import Routes from './routes.jsx';
import { setLines } from './redux/actions/line-actions';

// the front end should use the embedded line data
const lines = JSON.parse(document.getElementById('js-app-bundle').dataset.lines);
store.dispatch(setLines(lines));

export default (
  <Provider store={store}>
    {Routes}
  </Provider>
);
