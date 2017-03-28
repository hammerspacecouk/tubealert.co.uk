'use strict';

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducers from './redux/reducers';

import { routerReducer, routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

let middleWare;
if (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__) {
    middleWare = compose(
        applyMiddleware(thunk,
            routerMiddleware(createHistory())
        ),
        window.__REDUX_DEVTOOLS_EXTENSION__()
    );
} else {
    middleWare = applyMiddleware(
        thunk,
        routerMiddleware(createHistory())
    );
}

const store = createStore(
    combineReducers({
        ...reducers,
        router: routerReducer
    }),
    middleWare
);
export default store;
