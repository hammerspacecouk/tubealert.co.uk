'use strict';

import React from 'react';
import {Route, BrowserRouter} from 'react-router-dom';

import BaseContainer from './containers/BaseContainer.jsx';
import Index from './components/Index.jsx';
import Settings from './components/Settings.jsx';
import LineContainer from './containers/LineContainer.jsx';

const routes = (
    <BrowserRouter>
        <BaseContainer>
            <Route exact name="index" path="/" component={Index}/>
            <Route name="settings" path='/settings' component={Settings} />
            <Route name="line" path='/:lineKey' component={LineContainer} />
        </BaseContainer>
    </BrowserRouter>
);

export default routes;