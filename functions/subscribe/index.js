'use strict';

const TubeAlert = require('tubealert');
const Slots = require('./Slots');

exports.handler = (event, context) => {

    const body = JSON.parse(event.body);
    const userID = body.userID;
    const lineID = body.lineID;
    const timeSlots = body.timeSlots;
    const subscription = body.subscription;

    console.log('Subscribing ' + userID);

    // process the time slots
    const slots = new Slots(timeSlots);

    // create the PUT items
    const puts = slots.getPuts(subscription, lineID);
    console.log(puts.length + " puts");

    TubeAlert.Data.getUserLineSubscriptions(userID, lineID)
        .then(data => {
            console.log(data);
            // check for any DELETE items needed
            const deletes = slots.getDeletes(data);
            console.log(deletes.length + " deletes");
            return puts.concat(deletes);
        })
        .then(TubeAlert.Data.batchWrite)
        .then(() => {
            context.succeed({
                "statusCode": 200,
                "headers": {"access-control-allow-origin" : "*"},
                "body": JSON.stringify({status : "ok"})
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
