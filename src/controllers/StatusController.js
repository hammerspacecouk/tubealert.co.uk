const emptyCache = {
  expires: 0,
  data: null
};
let statusCache = emptyCache;

class StatusController {
  /**
   * @param callback
   * @param dateTimeHelper
   * @param status
   * @param jsonResponseHelper
   * @param logger
   */
  constructor(callback, dateTimeHelper, status, jsonResponseHelper, logger) {
    this.callback = callback;
    this.dateTimeHelper = dateTimeHelper;
    this.status = status;
    this.jsonResponseHelper = jsonResponseHelper;
    this.logger = logger;
  }

  static clearCache() {
    statusCache = emptyCache;
  }

  /**
   * Fetch the latest statues for all lines
   * @returns {Promise.<TResult>}
   */
  latestAction() {
    const now = Date.now();
    if (statusCache.expires > now) {
      // cache locally if the container is still alive
      this.logger.info('Data is still in cache. Using it');
      return this.callback(null, this.jsonResponseHelper.createResponse(statusCache.data, 120));
    }

    return this.status.getAllLatest(this.dateTimeHelper.getNow())
      .then((data) => {
        this.logger.info('Successfully fetched latest statuses');
        this.logger.info('Caching the result');
        statusCache = {
          expires: now + (120 * 1000),
          data
        };
        return this.callback(null, this.jsonResponseHelper.createResponse(data, 120));
      })
      .catch((err) => {
        this.logger.error(err);
        return this.callback(true, this.jsonResponseHelper.createErrorResponse(
          'Failed to fetch latest status'
        ));
      });
  }
}

module.exports = StatusController;
