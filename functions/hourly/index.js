'use strict';

const AWS = require('aws-sdk');
const Webpush = require('web-push');

console.log(process.env.PUBLIC_KEY,
    process.env.PRIVATE_KEY);

Webpush.setGCMAPIKey('1049276846959');
Webpush.setVapidDetails(
    'mailto:contact@hammerspace.co.uk',
    process.env.PUBLIC_KEY,
    process.env.PRIVATE_KEY
);

const dynamoParams = {
    // endpoint: 'http://localhost:8000',
    region: 'eu-west-2'
};

const docClient = new AWS.DynamoDB.DocumentClient(dynamoParams);

const tableName = 'tubealert.co.uk_subscriptions';

function fetcher() {}

const notifyUser = (user) => {
    const subscription = user.Subscription;
    Webpush.sendNotification(subscription, 'Yo Dawg')
        .then(data => {console.log(data)})
        .catch(err => {console.log(err)});
};

const notifyUsers = (result, callback) => {
    const users = result.Items;
    console.log('Sending to ' + users.length + ' users');
    const notifications = users.map(user => {
        const subscription = user.Subscription;
        const payload = {
            title: "oi",
            body: "pay attention",
            icon: "http://localhost:8080/icon-bakerloo-line.png",
            tag: "/bakerloo-line"
        };
        return Webpush.sendNotification(subscription, JSON.stringify(payload));
    });
    Promise.all(notifications)
        .then(data => {
            callback(null, "All success")
        })
        .catch(err => {
            callback(err, "An error occurred")
        });
};

fetcher.handler = (event, context, callback) => {

    const lineId = 'bakerloo-line';

    console.log("Getting relevant users to notify");
    // todo - restrict to this hour and broken lines
    const params = {
        TableName: tableName,
        IndexName: 'index_lineSlot',
        KeyConditionExpression: '#line = :line',
        ExpressionAttributeNames: {
            '#line': 'LineSlot'
        },
        ExpressionAttributeValues: {
            ':line': lineId + '_0000'
        }
    };
    docClient.query(params, function(err, data) {
        if (err) {
            console.log(err);
            callback(err);
            return;
        }

        return notifyUsers(data, callback);
    });
};

exports.handler = fetcher.handler;