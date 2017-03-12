'use strict';

import React from 'react';
import {Route} from 'react-router-dom';

import BaseContainer from './containers/BaseContainer.jsx';
import Index from './components/Index.jsx';
import Settings from './components/Settings.jsx';
import LineContainer from './containers/LineContainer.jsx';

const routes = (
    <Route component={BaseContainer}>
        <Route exact path="/" component={Index}/>
        <Route path='/settings' component={Settings} />
        <Route path='/:lineKey' component={LineContainer} />
    </Route>
);

export default routes;
