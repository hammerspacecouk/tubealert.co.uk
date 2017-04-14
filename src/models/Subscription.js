"use strict";

const TABLE_NAME_SUBSCRIPTIONS = "tubealert.co.uk_subscriptions";

class Subscription {
    constructor(documentClient, logger) {
        this.documentClient = documentClient;
        this.logger = logger;
    }

    unsubscribeUser(userID) {
        return this.getUserSubscriptions(userID)
            .then(data => {
                const requests = data.map(this.createDeleteRequest);
                this.logger.info(requests.length + ' items total');
                return requests;
            })
            .then(requests => this.batchWrite(requests, requests.length));
    }

    createDeleteRequest(item) {
        return {
            DeleteRequest: {
                Key: {
                    UserID: item.UserID,
                    LineSlot: item.LineSlot
                }
            }
        }
    };

    getUserSubscriptions(userID) {
        const params = {
            TableName: TABLE_NAME_SUBSCRIPTIONS,
            KeyConditionExpression: "#user = :user",
            ExpressionAttributeNames: {
                "#user": "UserID"
            },
            ExpressionAttributeValues: {
                ":user": userID
            }
        };

        return this.documentClient.query(params).promise()
            .then(result => result.Items);
    }


    batchWrite(requests, total) {
        if (requests.length === 0) {
            // nothing to do. get out and return the original count
            return total;
        }

        // can only process 25 at a time
        const toProcess = requests.slice(0, 25);
        const remaining = requests.slice(25);
        this.logger.info("Processing " + toProcess.length + " items");

        // perform the batch request
        const params = {
            RequestItems : {}
        };
        params.RequestItems[TABLE_NAME_SUBSCRIPTIONS] = toProcess;

        return this.documentClient.batchWrite(params).promise()
            .then(data => {
                // put any UnprocessedItems back onto remaining list
                if ("UnprocessedItems" in data && TABLE_NAME_SUBSCRIPTIONS in data.UnprocessedItems) {
                    remaining.push(data.UnprocessedItems[TABLE_NAME_SUBSCRIPTIONS]);
                }
                return remaining;
            })
            .then(remaining => this.batchWrite(remaining, total));
    };
}

module.exports = Subscription;
