'use strict';

import React from 'react';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';

import BaseContainer from './containers/BaseContainer.jsx';
import Index from './components/Index.jsx';
import Settings from './components/Settings.jsx';
import LineContainer from './containers/LineContainer.jsx';

const routes = (
    <Router history={browserHistory}>
        <Route path='/' component={BaseContainer}>
            <IndexRoute name="index" component={Index}/>
            <Route name="settings" path='/settings' component={Settings} />
            <Route name="line" path='/:lineKey' component={LineContainer} />
        </Route>
    </Router>
);

export default routes;