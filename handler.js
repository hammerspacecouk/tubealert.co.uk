'use strict';

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

module.exports.all = (event, context, callback) => {
    const response = {
        "statusCode": 200,
        "headers": {
          "access-control-allow-origin": "*",
          "cache-control": "public, max-age: 120"
        },
        "body": JSON.stringify({
            "message": 'All data',
        }),
    };

    callback(null, response);
};

module.exports.subscribe = (event, context, callback) => {
    const response = {
        "statusCode": 200,
        "headers": {"access-control-allow-origin" : "*"},
        "body": JSON.stringify({status : "ok"}),
    };

    callback(null, response);
};

module.exports.unsubscribe = (event, context, callback) => {
    const response = {
        "statusCode": 200,
        "headers": {"access-control-allow-origin" : "*"},
        "body": JSON.stringify({status : "ok"}),
    };

    callback(null, response);
};

module.exports.fetch = (event, context, callback) => {
    callback(null, "Done");

    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
    // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};