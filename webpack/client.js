// setup react and app
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { getLines } from '../src/webapp/db';
import store from '../src/webapp/store';
import Routes from '../src/webapp/routes.jsx';
import { setLines, readLines } from '../src/webapp/redux/actions/line-actions';

// other static assets (only relevant for client)
import '../src/scss/all.scss';
import '../src/imgs';

const init = () => {
  const savedLines = getLines();

  if (savedLines.length > 0) {
    // read the saved lines and go and fetch newer asynchronously
    store.dispatch(readLines(savedLines));
  } else {
    // first time visit, use the embedded data (save a second call)
    const lines = JSON.parse(document.getElementById('js-app-bundle').dataset.lines);
    store.dispatch(setLines(lines));
  }

  ReactDOM.render(
    <Provider store={store}>
      {Routes}
    </Provider>,
    document.getElementById('webapp')
  );

  if ('serviceWorker' in window.navigator) {
      window.navigator.serviceWorker.register(`/sw.js`, {scope:'/'});
  }
};

// only modern browsers that support fetch will run this JS app
if (window.fetch) {
  init(4); // version number
}
