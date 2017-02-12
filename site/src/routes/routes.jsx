'use strict';

const React = require('react');
const ReactRouter = require('react-router');
const Router = ReactRouter.Router;
const Route = ReactRouter.Route;
const IndexRoute = ReactRouter.IndexRoute;
const browserHistory = ReactRouter.browserHistory;

module.exports = (
    <Router history={browserHistory}>
        <Route path='/' component={require('../views/Layout.jsx')}>
            <IndexRoute component={require('../views/Index.jsx')}/>
            <Route path='settings' component={require('../views/Settings.jsx')} />
            <Route path=':line' component={require('../views/Line.jsx')} />
        </Route>
    </Router>
);
