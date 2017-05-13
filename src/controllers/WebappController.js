const App = require('../../build/app.js'); // Load the compiled App entry point

const emptyCache = {
  expires: 0,
  data: null
};
let statusCache = emptyCache;

class WebappController {
  constructor(callback, logger, assetsHelper, dateTimeHelper, status) {
    this.callback = callback;
    this.logger = logger;
    this.assetsHelper = assetsHelper;
    this.dateTimeHelper = dateTimeHelper;
    this.status = status;
  }

  static clearCache() {
    statusCache = emptyCache;
  }

  loadApp(data, path) {
    return App.default(data, path, this.assetsHelper, body => this.callback(
      null,
      {
        statusCode: 200,
        headers: {
          'content-type': 'text/html; charset=utf-8'
        },
        body,
      }
    ));
  }

  invokeAction(event) {
    // get the path
    const path = event.path;
    this.logger.info(`Request for ${path}`);

    // stop erroneous favicon requests costing money
    if (path === '/favicon.ico') {
      return this.callback(
        null,
        {
          statusCode: 404,
          headers: {
            'cache-control': `public, max-age=${60 * 60 * 24 * 60}`
          },
          body: 'Not found'
        }
      );
    }

    const now = Date.now();
    if (statusCache.expires > now) {
      // cache locally if the container is still alive
      this.logger.info('Data is still in cache. Using it');
      return this.loadApp(statusCache.data, path);
    }

    return this.status.getAllLatest(this.dateTimeHelper.getNow())
      .then((data) => {
        this.logger.info('Successfully fetched latest statuses');
        this.logger.info('Caching the result');
        statusCache = {
          expires: now + (120 * 1000),
          data
        };
        return this.loadApp(data, path);
      })
      .catch((err) => {
        this.logger.error(err);
        return this.callback(
          true,
          {
            statusCode: 500,
            headers: {
              'content-type': 'text/html; charset=utf-8',
              'cache-control': `public, max-age=${60 * 15}`
            },
            body: 'Failed to fetch data',
          }
        );
      });
  }
}

module.exports = WebappController;
