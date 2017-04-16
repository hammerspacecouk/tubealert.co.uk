"use strict";

const TABLE_NAME_NOTIFICATIONS = "tubealert.co.uk_notifications";

class Notification {
    constructor(
        documentClient,
        webPush,
        assetManifest,
        dateTimeHelper,
        batchWriteHelper,
        config,
        logger
    ) {
        this.documentClient = documentClient;
        this.webPush = webPush;
        this.assetManifest = assetManifest;
        this.dateTimeHelper = dateTimeHelper;
        this.batchWriteHelper = batchWriteHelper;
        this.config = config;
        this.logger = logger;
    }

    /**
     * Looks for users subscribed to this line at this time, and
     * creates a notification item for them
     * @param inputs
     */
    createNotifications(inputs) {
        const count = inputs.length;
        if (count === 0) {
            this.logger.info("No notifications to be made");
            return;
        }

        this.logger.info("Creating " + count + " notifications");
        const requestItems = inputs.map(this.createNotification.bind(this));
        const batchWriter = new this.batchWriteHelper(this.documentClient, TABLE_NAME_NOTIFICATIONS, this.logger);

        return batchWriter.makeRequests(requestItems);
    }

    createNotification(input) {
        const lineData = input.lineData;
        const subscription = input.subscription.Subscription;

        // generate a randomish UUID
        const notificationID = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            let r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });

        this.logger.info("Creating Notification with ID: " + notificationID);

        const item = {
            NotificationID: notificationID,
            Subscription: subscription,
            Payload: JSON.stringify({
                title: lineData.name,
                body: lineData.statusSummary,
                icon: this.config.STATIC_HOST + this.assetManifest["icon-" + lineData.urlKey + ".png"],
                tag: "/" + lineData.urlKey
            }),
            Created: this.dateTimeHelper.getNow().toISOString(),
        };
        return {
            PutRequest : {
                Item: item
            }
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
        const batchWriter = new this.batchWriteHelper(this.documentClient, TABLE_NAME_NOTIFICATIONS, this.logger);
        const deleteRequest = {
            DeleteRequest: {
                Key: {
                    NotificationID: notificationID
                }
            }
        };

        this.logger.info("Handling notification " + notificationID);
        return this.webPush.sendNotification(subscription, payload)
            .then(() => {
                this.logger.info("Notification sent. Deleting record");
                return batchWriter.makeRequests([deleteRequest])
            });
    }
}

module.exports = Notification;
