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

    if (path === '/favicon.ico') {
      return this.callback(null, {
        statusCode: 404,
        headers: {
          'cache-control': `public, max-age=${60 * 60 * 24 * 60}`
        }
      });
    }

    // get the data

    // call the react app
    const body = ReactDOMServer.renderToString(App);

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
    <title>TubeAlert</title>
    <link rel="stylesheet" href="${this.assetsHelper.get('app.css')}" />
    <link rel="apple-touch-icon" sizes="180x180" 
      href="${this.assetsHelper.get('apple-touch-icon.png')}" />
    <link rel="icon" type="image/png" sizes="32x32" 
      href="${this.assetsHelper.get('favicon-32x32.png')}" />
    <link rel="icon" type="image/png" sizes="16x16"
      href="${this.assetsHelper.get('favicon-16x16.png')}" />
    <link rel="manifest" href="${this.assetsHelper.get('manifest.json')}" />
    <link rel="mask-icon" color="#3a3a3f" 
      href="${this.assetsHelper.get('safari-pinned-tab.svg')}" />
    <link rel="shortcut icon" href="${this.assetsHelper.get('favicon.ico')}" />
    <meta name="apple-mobile-web-app-title" content="TubeAlert" />
    <meta name="application-name" content="TubeAlert" />
    <meta name="msapplication-config" content="${this.assetsHelper.get('browserconfig.xml')}" />
    <meta name="theme-color" content="#3a3a3f" />
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
