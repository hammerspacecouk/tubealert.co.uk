'use strict';

import React from 'react';
import * as ReactRouter from 'react-router';
import Layout from '../views/Layout.jsx';
import Index from '../views/Index.jsx';
import Settings from '../views/Settings.jsx';
import Line from '../views/Line.jsx';

const Router = ReactRouter.Router;
const Route = ReactRouter.Route;
const IndexRoute = ReactRouter.IndexRoute;
const browserHistory = ReactRouter.browserHistory;

const routes = (
    <Router history={browserHistory}>
        <Route path='/' component={Layout}>
            <IndexRoute component={Index}/>
            <Route path='settings' component={Settings} />
            <Route path=':line' component={Line} />
        </Route>
    </Router>
);

export default routes;