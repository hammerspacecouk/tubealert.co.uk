import React from "react";
import { Router, Route, IndexRoute, browserHistory } from "react-router";

import BaseContainer from "./containers/BaseContainer.jsx";
import Index from "./components/Index.jsx";
import SettingsContainer from "./containers/SettingsContainer.jsx";
import LineContainer from "./containers/LineContainer.jsx";

const isBrowser = typeof window !== "undefined";

const history = isBrowser ? browserHistory : null;

const handleUpdate = () => {
  if (isBrowser) {
    window.scrollTo(0, 0);
  }
};

const routes = (
  <Router onUpdate={handleUpdate} history={history}>
    <Route path="/" component={BaseContainer}>
      <IndexRoute name="index" component={Index} />
      <Route name="settings" path="/settings" component={SettingsContainer} />
      <Route name="line" path="/:lineKey" component={LineContainer} />
    </Route>
  </Router>
);

export default routes;
