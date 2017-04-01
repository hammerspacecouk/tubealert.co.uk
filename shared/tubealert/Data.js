"use strict";

const AWS = require("aws-sdk");

const dynamoParams = {region: "eu-west-2"};

const docClient = new AWS.DynamoDB.DocumentClient(dynamoParams);

const TABLE_NAME_SUBSCRIPTIONS = "tubealert.co.uk_subscriptions";
const TABLE_NAME_STATUSES = "tubealert.co.uk_statuses";

const calculateTubeDate = moment => {
    const hour = moment.hours();
    const date = moment;
    if (hour <= 3) {
        // the tube date is yesterday
        date.subtract(1, "days");
    }
    return date.format("DD-MM-YYYY");
};

const batchWriteSubscriptions = requests => {
    if (requests.length === 0) {
        // nothing to do. get out
        return;
    }

    // can only process 25 at a time
    const toProcess = requests.slice(0, 25);
    const remaining = requests.slice(25);
    console.log("Processing " + toProcess.length + " items");

    // perform the batch request
    const params = {
        RequestItems : {}
    };
    params.RequestItems[TABLE_NAME_SUBSCRIPTIONS] = toProcess;

    return docClient.batchWrite(params).promise()
        .then(data => {
            // put any UnprocessedItems back onto remaining list
            if ("UnprocessedItems" in data && TABLE_NAME_SUBSCRIPTIONS in data.UnprocessedItems) {
                remaining.push(data.UnprocessedItems[TABLE_NAME_SUBSCRIPTIONS]);
            }
            return remaining;
        })
        .then(batchWriteSubscriptions);
};

const getUserSubscriptions = (userID) => {
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

    return docClient.query(params).promise()
        .then(result => (result.Items));
};

const getUserLineSubscriptions = (userID, lineID) => {
    console.log("Getting current user line subscriptions for line: " + lineID);
    const params = {
        TableName: TABLE_NAME_SUBSCRIPTIONS,
        KeyConditionExpression: "#user = :user and begins_with(#line, :line)",
        ExpressionAttributeNames: {
            "#user": "UserID",
            "#line": "LineSlot"
        },
        ExpressionAttributeValues: {
            ":user": userID,
            ":line": lineID + "_"
        }
    };

    return docClient.query(params).promise()
        .then(result => (result.Items));
};

const leftPad = (num) => {
    let str = num.toString();
    if (str.length < 2) {
        str = "0" + str;
    }
    return str;
};

const getSubscriptionsForLineSlot = (lineID, date) => {
    const lineSlot = lineID + "_" + leftPad(date.day()) + leftPad(date.hours());
    const params = {
        TableName: TABLE_NAME_SUBSCRIPTIONS,
        IndexName: "index_lineSlot",
        KeyConditionExpression: "#line = :line",
        ExpressionAttributeNames: {
            "#line": "LineSlot"
        },
        ExpressionAttributeValues: {
            ":line": lineSlot
        }
    };
    return docClient.query(params).promise()
        .then(result => (result.Items));
};

const getSubscriptionsStartingInLineSlot = (lineID, date) => {
    const hour = date.hours();
    const lineSlot = lineID + "_" + leftPad(date.day()) + leftPad(hour);
    const params = {
        TableName: TABLE_NAME_SUBSCRIPTIONS,
        IndexName: "index_lineSlot",
        KeyConditionExpression: "#line = :line",
        FilterExpression : "#start = :start",
        ExpressionAttributeNames: {
            "#line": "LineSlot",
            "#start": "WindowStart"
        },
        ExpressionAttributeValues: {
            ":line": lineSlot,
            ":start": hour
        }
    };
    return docClient.query(params).promise()
        .then(result => (result.Items));
};

const storeStatus = (date, data) => {
    const tubeDate = calculateTubeDate(date);
    const params = {
        TableName: TABLE_NAME_STATUSES,
        Item: {
            TubeDate: tubeDate,
            Timestamp: date.unix(),
            Statuses: data
        }
    };
    return docClient.put(params).promise();
};

const getLatestStatus = (date) => {
    const tubeDate = calculateTubeDate(date);
    console.log("Getting current status for " + tubeDate);
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
    return docClient.query(params).promise()
        .then(result => {
            if (result.Items.length > 0) {
                return result.Items[0].Statuses
            }
            return null;
        })
};

exports.batchWrite = batchWriteSubscriptions;
exports.getSubscriptionsForLineSlot = getSubscriptionsForLineSlot;
exports.getSubscriptionsStartingInLineSlot = getSubscriptionsStartingInLineSlot;
exports.getUserSubscriptions = getUserSubscriptions;
exports.getUserLineSubscriptions = getUserLineSubscriptions;
exports.storeStatus = storeStatus;
exports.getLatestStatus = getLatestStatus;
