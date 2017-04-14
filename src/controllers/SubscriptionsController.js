"use strict";

class SubscriptionsController {
    constructor(callback, subscription, jsonResponseHelper, logger) {
        this.callback = callback;
        this.subscription = subscription;
        this.jsonResponseHelper = jsonResponseHelper;
        this.logger = logger;
    }

    subscribeAction() {
        const data = {"message": "All data"};
        this.callback(null, this.jsonResponseHelper.createResponse(data));
    }

    unsubscribeAction(event) {
        const body = JSON.parse(event.body);
        const userID = body.userID;
        this.logger.info('Unsubscribing ' + userID);

        return this.subscription.unsubscribeUser(userID)
            .then((removedCount) => {

                this.logger.info("Successfully unsubscribed from " + removedCount + " items");
                return this.callback(null, this.jsonResponseHelper.createResponse({
                    status : "success",
                    removed : removedCount
                }));
            })
            .catch(err => {
                this.logger.error(err);
                return this.callback(true, this.jsonResponseHelper.createErrorResponse(
                    "Failed to unsubscribe"
                ));
            });
    }
}

module.exports = SubscriptionsController;
