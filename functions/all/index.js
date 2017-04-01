"use strict";

const Moment = require("moment-timezone");
const TubeAlert = require("tubealert");

exports.handler = (event, context) => {
    const now = Moment(new Date()).tz('Europe/London');
    TubeAlert.Data.getLatestStatus(now)
        .then(data => {
            context.succeed({
                "statusCode": 200,
                "headers": {
                    "access-control-allow-origin": "*",
                    "cache-control": "public, max-age: 120"
                },
                "body": JSON.stringify(data)
            });
        })
        .catch(err => {
            console.error(err);
            context.fail({
                "statusCode": 500,
                "headers": {"access-control-allow-origin" : "*"},
                "body": JSON.stringify({status:"error"})
            });
        });
};
