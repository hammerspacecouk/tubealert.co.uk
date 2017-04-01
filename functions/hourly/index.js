'use strict';

const Moment = require("moment-timezone");
const TubeAlert = require("tubealert");
const Notifications = new TubeAlert.Notifications(
    process.env.PUBLIC_KEY,
    process.env.PRIVATE_KEY
);

let now = null;

const notifyUsers = (users, lineData) => {
    console.log('Sending to ' + users.length + ' users');
    const notifications = users.map(user => {
        const subscription = user.Subscription;
        return Notifications.send(subscription, lineData);
    });
    return Promise.all(notifications);
};

const checkLines = (data) => {
    console.log("Checking for disrupted lines");
    const brokenLines = data.filter(line => {
       return line.isDisrupted;
    });
    console.log(brokenLines.length + " found");

    console.log("Getting subscriptions");
    return Promise.all(brokenLines.map(lineData => (
        TubeAlert.Data.getSubscriptionsStartingInLineSlot(lineData.urlKey, now)
            .then((result) => {
                return notifyUsers(result, lineData)
            })
    )))
};

exports.handler = (event, context, callback) => {

    // todo - get latest status, and look for currently broken lines

    now = Moment(new Date()).tz('Europe/London');
    const currentDay = now.day();
    const currentHour = now.hours();

    console.log("Getting the latest status");
    TubeAlert.Data.getLatestStatus(now)
        .then(checkLines)
        .then(() => {
            callback(null, "All done");
        })
        .catch(err => {
            console.error(err);
            callback(err, "An error occurred");
        })
};
