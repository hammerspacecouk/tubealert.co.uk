'use strict';

const AWS = require('aws-sdk');
const Slots = require('./Slots');

const dynamoParams = {
    // endpoint: 'http://localhost:8000',
    region: 'eu-west-2'
};

const docClient = new AWS.DynamoDB.DocumentClient(dynamoParams);

const tableName = 'tubealert.co.uk_subscriptions';

function fetcher() {}

const processBatch = (requests, context, callback) => {
    // get the first 25 items;
    const toProcess = requests.slice(0, 25);
    const remaining = requests.slice(25);

    // perform the batch request
    const params = {
        RequestItems : {}
    };
    params.RequestItems[tableName] = toProcess;

    docClient.batchWrite(params, function(err, data) {
        if (err) {
            // todo: try again
            console.log(err);
            callback("Error", err);
        } else {
            // put any UnprocessedItems back onto remaining list
            if ('UnprocessedItems' in data && tableName in data.UnprocessedItems) {
                params.RequestItems[tableName].push(data.UnprocessedItems[tableName]);
            }

            if (remaining.length > 0) {
                return processBatch(remaining, context, callback);
            }
            return context.succeed({
                "statusCode": 200,
                "headers": {
                    "access-control-allow-origin" : "*"
                },
                "body": JSON.stringify({
                    status : "ok"
                })
            });
        }
    });
};

fetcher.handler = (event, context, callback) => {

    const body = JSON.parse(event.body);

    const userId = body.userID;
    const lineId = body.lineID;
    const timeSlots = body.timeSlots;
    const subscription = body.subscription;
    console.log(userId);
    // [
    //     [false, true, true],
    //     [false, false, false, true, true, false, true, false, false, false, false, true, false, false]
    // ]; // todo - get this from the context

    // process the timeslots
    const slots = new Slots(timeSlots);

    // create the PUT items
    const puts = slots.getPuts(subscription, lineId);
    console.log(puts.length + " puts");

    // get all the slots for this user and line
    const params = {
        TableName: tableName,
        KeyConditionExpression: '#user = :user and begins_with(#line, :line)',
        ExpressionAttributeNames: {
            '#user': 'UserID',
            '#line': 'LineSlot'
        },
        ExpressionAttributeValues: {
            ':user': userId,
            ':line': lineId + '_'
        }
    };
    console.log("Getting current set");
    docClient.query(params, function(err, data) {
        if (err) {
            console.log(err);
            callback(err);
            return;
        }

        // check for any DELETE items needed
        const deletes = slots.getDeletes(data.Items);
        console.log(deletes.length + " deletes");

        const requests = puts.concat(deletes);

        processBatch(requests, context, callback);
    });
};

exports.handler = fetcher.handler;