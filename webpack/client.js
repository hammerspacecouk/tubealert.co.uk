// setup react and app
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from '../src/webapp/store';
import Routes from '../src/webapp/routes.jsx';
import { setLines } from '../src/webapp/redux/actions/line-actions';

// other static assets (only relevant for client)
import '../src/scss/all.scss';
import '../src/imgs';

const init = () => {
  // the front end should use the embedded line data
  const lines = JSON.parse(document.getElementById('js-app-bundle').dataset.lines);
  store.dispatch(setLines(lines));

  ReactDOM.render(
    <Provider store={store}>
      {Routes}
    </Provider>,
    document.getElementById('webapp')
  );

// if ('serviceWorker' in window.navigator) {
//     window.navigator.serviceWorker.register('/sw.js', {scope:'/'});
// }
};

// only modern browsers that support fetch will run this JS app
if (window.fetch) {
  init();
}
