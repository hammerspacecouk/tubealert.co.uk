'use strict';

// setup react and routing
import ReactDOM from 'react-dom';
import App from './app/app.jsx';

// other static assets (only relevant for client)
import 'scss/all.scss';
import './imgs';

// only modern browsers that support fetch will run this JS app
if (window.fetch) {
    // ReactDOM.render(App, document);
    ReactDOM.render(App, document.getElementById('app'));
}

if ('serviceWorker' in window.navigator) {
    window.navigator.serviceWorker.register('/sw.js', {scope:'/'});
}
