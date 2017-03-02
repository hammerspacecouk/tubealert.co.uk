'use strict';

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducers from './redux/reducers';

let middleWare;
if (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__) {
    middleWare = compose(
        applyMiddleware(thunk),
        window.__REDUX_DEVTOOLS_EXTENSION__()
    );
} else {
    middleWare = applyMiddleware(thunk);
}

const store = createStore(
    reducers,
    middleWare
);
export default store;
