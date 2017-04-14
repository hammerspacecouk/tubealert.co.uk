"use strict";

const TABLE_NAME_STATUSES = "tubealert.co.uk_statuses";

class Status {
    constructor(documentClient, dateTimeHelper, logger) {
        this.documentClient = documentClient;
        this.dateTimeHelper = dateTimeHelper;
        this.logger = logger;
    }

    storeStatus(date, data) {
        const tubeDate = this.dateTimeHelper.getTubeDate(date);
        const params = {
            TableName: TABLE_NAME_STATUSES,
            Item: {
                TubeDate: tubeDate,
                Timestamp: date.unix(),
                Statuses: data
            }
        };
        return this.documentClient.put(params).promise();
    };

    getAllLatest(date) {
        this.logger.info(this.dateTimeHelper);
        const tubeDate = this.dateTimeHelper.getTubeDate(date);
        this.logger.info("Getting current status for " + tubeDate);
        const params = {
            TableName: TABLE_NAME_STATUSES,
            KeyConditionExpression: "#date = :date",
            ExpressionAttributeNames: {
                "#date": "TubeDate"
            },
            ExpressionAttributeValues: {
                ":date": tubeDate
            },
            ScanIndexForward: false
        };
        return this.documentClient.query(params).promise()
            .then(result => {
                if (result.Items.length > 0) {
                    return result.Items[0].Statuses
                }
                return null;
            })
    };
}

module.exports = Status;