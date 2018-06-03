import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Provider } from 'react-redux';
import { RouterContext, match } from 'react-router';
import { setLines } from '../src/webapp/redux/actions/line-actions';
import store from '../src/webapp/store';
import routes from '../src/webapp/routes.jsx';

export default (originalData, location, assetsHelper, callback) => {
  store.dispatch(setLines(originalData));

  match({ routes, location }, (error, redirectLocation, renderProps) => {
    const html = ReactDOMServer.renderToString(
      <Provider store={store}>
        <RouterContext {...renderProps} />
      </Provider>
    );

    return callback(`<!DOCTYPE html>
  <html lang="en-GB">
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>TubeAlert</title>
      <link rel="stylesheet" href="${assetsHelper.get('app.css')}" />
      <link rel="apple-touch-icon" sizes="1024x1024" 
        href="${assetsHelper.get('ios-appicon-1024-1024.png')}" />
      <link rel="apple-touch-icon" sizes="180x180" 
        href="${assetsHelper.get('ios-appicon-180-180.png')}" />
      <link rel="icon" type="image/png" sizes="32x32" 
        href="${assetsHelper.get('favicon-32x32.png')}" />
      <link rel="icon" type="image/png" sizes="16x16"
        href="${assetsHelper.get('favicon-16x16.png')}" />
      <link rel="manifest" href="${assetsHelper.get('manifest.json')}" />
      <link rel="mask-icon" color="#3a3a3f" 
        href="${assetsHelper.get('safari-pinned-tab.svg')}" />
      <link rel="shortcut icon" type="image/x-icon" href="${assetsHelper.get('favicon.ico')}" />
      <link rel="icon" type="image/x-icon" href="${assetsHelper.get('favicon.ico')}" />
      <meta name="apple-mobile-web-app-title" content="TubeAlert" />
      <meta name="application-name" content="TubeAlert" />
      <meta name="msapplication-config" content="${assetsHelper.get('browserconfig.xml')}" />
      <meta name="theme-color" content="#3a3a3f" />
      <meta name="google-site-verification" content="dSIKzBS-efQho6aWkl9Zuq6E7Mu8bbxaz6yyM64WQPg" />
    </head>
    <body>
      <div style="display:none">
        <svg>
            <symbol id="icon-chevron-left" viewBox="0 0 16 24">
              <path d="M14.88 2.878L5.756 12l9.124 9.142-2.81 2.808L.12 12 12.07.05l2.81 2.828z"></path>
            </symbol>
            <symbol id="icon-chevron-right" viewBox="0 0 16 24">
              <path d="M.12 21.122L9.244 12 .12 2.858 2.93.05 14.88 12 2.93 23.95.12 21.122z"></path>
            </symbol>
            <symbol id="icon-settings" viewBox="0 0 24 24">
              <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 
                3.5m7.43-2.53c.04-.32.07-.64.07-.97 
                0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 
                1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65c-.04-.24-.25-.42-.5-.42h-4c-.25 0-.46.18-.5.42l-.37 
                2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 
                11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97l-2.11 
                1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 
                2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 
                .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66z"></path>
            </symbol>
            <symbol id="icon-alert" viewBox="0 0 24 24">
              <path d="M13 13h-2V7h2m0 10h-2v-2h2M12 2A10 10 0 0 0 2 
                12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2z"></path>
            </symbol>
        </svg>
      </div>
      <div id="webapp">${html}</div>
      <script src="${assetsHelper.get('app.js')}" 
        data-lines="${JSON.stringify(originalData).replace(/"/g, '&quot;')}" id="js-app-bundle"></script>
      <script>
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
      
        ga('create', 'UA-96252214-2', 'auto');
        ga('send', 'pageview');
      </script>
    </body>
  </html>`
    );
  });
};
