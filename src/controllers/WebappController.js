const React = require('react');
const ReactDOMServer = require('react-dom/server');
const App = require('../../build/app.js');

class WebappController {
  constructor(callback, logger, assetsHelper) {
    this.callback = callback;
    this.logger = logger;
    this.assetsHelper = assetsHelper;
  }

  invokeAction(event) {
    // get the path
    const path = event.path;

    // get the data
    const props = {
      assetsHelper: this.assetsHelper
    };

    // call the react app
    const body = ReactDOMServer.renderToString(React.createFactory(App)(props));

    // return a response
    return this.callback(null, {
      statusCode: 200,
      headers: {
        'content-type': 'text/html'
      },
      body: `<!DOCTYPE html>\n${body}`,
    }
    );
  }
}

module.exports = WebappController;
