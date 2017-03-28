'use strict';

import React from 'react';
import {Route} from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory';

import BaseContainer from './containers/BaseContainer.jsx';
import Index from './components/Index.jsx';
import Settings from './components/Settings.jsx';
import LineContainer from './containers/LineContainer.jsx';

const routes = (
    <ConnectedRouter history={createHistory()}>
        <BaseContainer>
            <Route exact name="index" path="/" component={Index}/>
            <Route name="settings" path='/settings' component={Settings} />
            <Route name="line" path='/:lineKey' component={LineContainer} />
        </BaseContainer>
    </ConnectedRouter>
);

export default routes;