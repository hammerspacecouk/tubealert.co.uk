"use strict";

const Controllers = require("./src/DI").controllers;

// handlers
module.exports = {
    // data feed
    latest: (event, context, callback) => Controllers.status(callback).latestAction(),
    // user actions
    subscribe: (event, context, callback) => Controllers.subscriptions(callback).subscribeAction(event),
    unsubscribe: (event, context, callback) => Controllers.subscriptions(callback).unsubscribeAction(event),
    // cron jobs
    fetch: (event, context, callback) => Controllers.data(callback).fetchAction(),
    hourly: (event, context, callback) => Controllers.data(callback).hourlyAction(),
    // stream handler
    notify: (event, context, callback) => Controllers.data(callback).notifyAction(event),
    // website
    webapp: (event, context, callback) => {
        const response = {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Go Serverless v1.0! Your function executed successfully!',
                input: event,
            }),
        };
        callback(null, response);
    }
};