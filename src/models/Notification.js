

const TABLE_NAME_NOTIFICATIONS = 'tubealert.co.uk_notifications';

class Notification {
  constructor(
    documentClient,
    webPush,
    assetManifest,
    dateTimeHelper,
    BatchWriteHelper,
    config,
    logger
  ) {
    this.documentClient = documentClient;
    this.webPush = webPush;
    this.assetManifest = assetManifest;
    this.dateTimeHelper = dateTimeHelper;
    this.BatchWriteHelper = BatchWriteHelper;
    this.config = config;
    this.logger = logger;

    this.batchWriter = new this.BatchWriteHelper(
      this.documentClient,
      TABLE_NAME_NOTIFICATIONS,
      this.logger
    );
  }

  /**
   * Looks for users subscribed to this line at this time, and
   * creates a notification item for them
   * @param inputs
   */
  createNotifications(inputs) {
    const count = inputs.length;
    if (count === 0) {
      this.logger.info('No notifications to be made');
      return null;
    }

    this.logger.info(`Creating ${count} notifications`);
    const requestItems = inputs.map(this.createNotification.bind(this));
    return this.batchWriter.makeRequests(requestItems);
  }

  createNotification(input) {
    const lineData = input.lineData;
    const subscription = input.subscription.Subscription;

    const notificationID = Notification.createID();

    this.logger.info(`Creating Notification with ID: ${notificationID}`);

    const item = {
      NotificationID: notificationID,
      Subscription: subscription,
      Payload: JSON.stringify({
        title: lineData.name,
        body: lineData.statusSummary,
        icon: this.config.STATIC_HOST + this.assetManifest[`icon-${lineData.urlKey}.png`],
        tag: `/`,
      }),
      Created: this.dateTimeHelper.getNow().toISOString(),
    };
    return {
      PutRequest: {
        Item: item,
      },
    };
  }

  /**
   * Sends the notification to the user and deletes the row from the data store
   * @param rowData
   */
  handleNotification(rowData) {
    const payload = rowData.Payload;
    const subscription = rowData.Subscription;
    const notificationID = rowData.NotificationID;


    this.logger.info(`Handling notification ${notificationID}`);
    return this.webPush.sendNotification(subscription, payload)
      .then(() => {
        this.logger.info('Notification sent');
        return this.deleteNotification(notificationID);
      });
  }

  /**
   * Removes the notification row form the database as we are done with it
   * @param notificationID
   */
  deleteNotification(notificationID) {
    const deleteRequest = {
      DeleteRequest: {
        Key: {
          NotificationID: notificationID,
        },
      },
    };
    this.logger.info('Deleting notification record');
    return this.batchWriter.makeRequests([deleteRequest]);
  }

  static createID() {
    // generate a randomish UUID
    return (`${Math.random().toString(36)}00000000000000000`).slice(2, 18);
  }
}

module.exports = Notification;
