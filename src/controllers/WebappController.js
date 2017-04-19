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

    // call the react app
    const body = ReactDOMServer.renderToString(React.createFactory(App)());

    // return a response
    return this.callback(null, {
      statusCode: 200,
      headers: {
        'content-type': 'text/html'
      },
      body: `<!DOCTYPE html>
      <html lang="en-GB">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="stylesheet" href=${this.assetsHelper.get('app.css')} />
          <title>My Title</title>
        </head>
        <body>
          <div id="webapp">${body}</div>
          <script src="${this.assetsHelper.get('app.js')}" data-props="" id="js-bundle"></script>
        </body>
      </html>`,
    }
    );
  }
}

module.exports = WebappController;
