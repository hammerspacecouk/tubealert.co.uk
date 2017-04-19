'use strict';

// setup react and routing
import React from 'react';
import ReactDOM from 'react-dom';
import App from '../src/webapp/app.jsx';

// other static assets (only relevant for client)
import '../src/scss/all.scss';
import '../src/imgs';

console.log('client.js loaded');

// only modern browsers that support fetch will run this JS app
if (window.fetch) {
    console.log('mounting');
    ReactDOM.render(<App />, document.getElementById('webapp'));
}

// if ('serviceWorker' in window.navigator) {
//     window.navigator.serviceWorker.register('/sw.js', {scope:'/'});
// }
