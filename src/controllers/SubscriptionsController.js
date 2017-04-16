
class SubscriptionsController {
  constructor(callback, subscription, dateTimeHelper, jsonResponseHelper, logger) {
    this.callback = callback;
    this.subscription = subscription;
    this.dateTimeHelper = dateTimeHelper;
    this.jsonResponseHelper = jsonResponseHelper;
    this.logger = logger;
  }

  subscribeAction(event) {
    const body = JSON.parse(event.body);
    const userID = body.userID;
    const lineID = body.lineID;
    const timeSlots = body.timeSlots;
    const subscription = body.subscription;

    return this.subscription.subscribeUser(
      userID,
      lineID,
      timeSlots,
      subscription,
      this.dateTimeHelper.getNow(),
    )
      .then(() => {
        this.logger.info('Successfully subscribed');
        return this.callback(null, this.jsonResponseHelper.createResponse({ status: 'ok' }));
      })
      .catch(this.fail.bind(this));
  }

  unsubscribeAction(event) {
    const body = JSON.parse(event.body);
    const userID = body.userID;
    this.logger.info(`Unsubscribing ${userID}`);

    return this.subscription.unsubscribeUser(userID)
      .then((removedCount) => {
        this.logger.info(`Successfully unsubscribed from ${removedCount} items`);
        return this.callback(null, this.jsonResponseHelper.createResponse({
          status: 'success',
          removed: removedCount,
        }));
      })
      .catch(this.fail.bind(this));
  }

  fail(err) {
    this.logger.error(err);
    return this.callback(true, this.jsonResponseHelper.createErrorResponse(
      'Failed to perform action',
    ));
  }
}

module.exports = SubscriptionsController;
