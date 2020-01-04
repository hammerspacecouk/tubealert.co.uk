/**
 * This controller handles the routine jobs for fetching and storing
 */
class DataController {
  /**
   * @param callback
   * @param dynamoConverter
   * @param dateTimeHelper
   * @param statusModel
   * @param subscriptionModel
   * @param notificationModel
   * @param logger
   */
  constructor(callback, dynamoConverter, dateTimeHelper, statusModel, subscriptionModel, notificationModel, logger) {
    this.callback = callback;
    this.dynamoConverter = dynamoConverter;
    this.dateTimeHelper = dateTimeHelper;
    this.statusModel = statusModel;
    this.subscriptionModel = subscriptionModel;
    this.notificationModel = notificationModel;
    this.logger = logger;
  }

  /**
   * Fetch the latest statues for all lines
   * @returns {Promise.<TResult>}
   */
  fetchAction() {
    const now = this.dateTimeHelper.getNow();
    this.logger.info("Starting fetch action");
    this.logger.info(`Current datetime: ${now.toISOString()}`);
    const actions = [this.statusModel.getAllLatest(this.dateTimeHelper.getNow()), this.statusModel.fetchNewLatest()];

    return Promise.all(actions)
      .then(this.checkForNotifications.bind(this))
      .then(this.done.bind(this))
      .catch(this.error.bind(this));
  }

  hourlyAction() {
    const now = this.dateTimeHelper.getNow();
    this.logger.info("Running hourly check");
    return this.statusModel
      .getLatestDisrupted(now)
      .then(statuses => {
        const len = statuses.length;
        if (len === 0) {
          this.logger.info("Nothing currently disrupted");
          return [];
        }
        this.logger.info(`${len} disrupted lines`);
        return Promise.all(statuses.map(lineData => this.getLineSubscription(lineData, now)));
      })
      .then(this.produceNotifications.bind(this))
      .then(this.done.bind(this))
      .catch(this.error.bind(this));
  }

  notifyAction(event) {
    // only one record is processed at a time
    const record = event.Records[0];
    // only process INSERTS
    if (record.eventName !== "INSERT" || !record.dynamodb.NewImage) {
      this.logger.info("Event was not an INSERT");
      return this.callback(null, "Event was not an INSERT");
    }

    const rowData = this.dynamoConverter({
      M: record.dynamodb.NewImage,
    });
    this.logger.info("Sending a notification");
    return this.notificationModel
      .handleNotification(rowData)
      .then(this.done.bind(this))
      .catch(result => {
        const statusCode = result.statusCode;
        this.logger.info(statusCode + " response code");
        if (statusCode !== 404 && statusCode !== 410) {
          return this.error();
        }

        // 404 or 410 means the subscription is no longer valid and we should remove it from our database
        this.logger.info("Subscription no longer exists");
        return this.removeOldSubscription(rowData)
          .then(this.done.bind(this))
          .catch(this.error.bind(this));
      });
  }

  getLineSubscription(lineData, now) {
    return this.subscriptionModel.getSubscriptionsStartingInLineSlot(lineData.urlKey, now).then(subscriptions =>
      subscriptions.map(subscription => ({
        lineData,
        subscription,
      }))
    );
  }

  removeOldSubscription(rowData) {
    const userID = rowData.Subscription.endpoint;
    const notificationID = rowData.NotificationID;
    this.logger.info("Removing subscriptions");
    return this.subscriptionModel.unsubscribeUser(userID).then(_ => {
      return this.notificationModel.deleteNotification(notificationID);
    });
  }

  checkForNotifications(results) {
    this.logger.info("Comparing status changes to see if anyone needs to be notified");
    const originalStatuses = results[0];
    const newStatuses = results[1];
    if (originalStatuses.length === 0) {
      this.logger.info("No status for this tubeDate to check against");
      return null;
    }
    this.logger.info("Looking for lines that have changed");
    const subscriptionsToNotify = [];

    newStatuses.forEach((line, key) => {
      const prevLine = originalStatuses[key];
      const disrupted = line.isDisrupted ? 1 : 0;
      this.logger.info(`[DISRUPTION STATUS] ${line.urlKey} ${disrupted}`);

      if (line.urlKey !== prevLine.urlKey) {
        this.logger.error("Previous and Current statuses are in different order. Catch it next time");
        return;
      }
      if (line.statusSummary !== prevLine.statusSummary) {
        this.logger.info(`${line.name} has changed. Was: ${prevLine.statusSummary}. Now: ${line.statusSummary}`);
        subscriptionsToNotify.push(
          this.subscriptionModel
            .getSubscriptionsForLineSlot(line.urlKey, this.dateTimeHelper.getNow())
            .then(subscriptions =>
              subscriptions.map(subscription => ({
                lineData: line,
                subscription,
              }))
            )
        );
      }
    });
    return Promise.all(subscriptionsToNotify).then(this.produceNotifications.bind(this));
  }

  done() {
    this.callback(null, "All done");
  }

  error(err) {
    this.logger.error(err);
    this.callback("Failed to complete");
  }

  produceNotifications(linesSubscriptions) {
    // merge all the line options
    const subscriptions = [].concat(...linesSubscriptions);
    return this.notificationModel.createNotifications(subscriptions);
  }
}

module.exports = DataController;
