'use strict';

// setup react and app
import React from 'react';
import ReactDOM from 'react-dom';
import App from '../src/webapp/app-client.jsx';

// other static assets (only relevant for client)
import '../src/scss/all.scss';
import '../src/imgs';

// only modern browsers that support fetch will run this JS app
if (window.fetch) {
  console.log('go go go');
  ReactDOM.render(App, document.getElementById('webapp'));
}

// if ('serviceWorker' in window.navigator) {
//     window.navigator.serviceWorker.register('/sw.js', {scope:'/'});
// }
