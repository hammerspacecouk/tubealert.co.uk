'use strict';

const DI = require("./src/DI");

// handlers
module.exports.webapp = (event, context, callback) => {
    const response = {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Go Serverless v1.0! Your function executed successfully!',
          input: event,
        }),
    };

    callback(null, response);
};

module.exports.latest = (event, context, callback) =>
    DI.controllers.status(callback).latestAction();

module.exports.subscribe = (event, context, callback) => {
    const response = {
        "statusCode": 200,
        "headers": {"access-control-allow-origin" : "*"},
        "body": JSON.stringify({status : "ok"}),
    };

    callback(null, response);
};

module.exports.unsubscribe = (event, context, callback) =>
    DI.controllers.subscriptions(callback).unsubscribeAction(event);

module.exports.fetch = (event, context, callback) => {
    callback(null, "Done");

    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
    // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};