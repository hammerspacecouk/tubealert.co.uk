'use strict';

// setup react and routing
import ReactDOM from 'react-dom';
import App from './app/app.jsx';

// only modern browsers that support fetch will run this JS app
if (window.fetch) {
    // ReactDOM.render(App, document);
    ReactDOM.render(App, document.getElementById('app'));
}
