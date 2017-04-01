"use strict";

const fetch = require("node-fetch");
const Moment = require("moment-timezone");
const TubeAlert = require("tubealert");
const Notifications = new TubeAlert.Notifications(
    process.env.PUBLIC_KEY,
    process.env.PRIVATE_KEY
);

let now = null;
let previousStatus = null;

const addStatusData = (lineData, lineStatus) => {
    // set some defaults
    delete lineData.tflKey;
    lineData.isDisrupted = null;
    lineData.updatedAt = now.toISOString();
    lineData.statusSummary = "No Information";
    lineData.latestStatus = {
        updatedAt : now.toISOString(),
        isDisrupted : null,
        title : "No Information",
        shortTitle : "No Information",
        descriptions : null
    };

    if (lineStatus) {
        const severities = TubeAlert.Lines.severities;
        const sortedStatuses = lineStatus.lineStatuses.sort((a, b) => {
            return severities[a.statusSeverity-1].displayOrder - severities[b.statusSeverity-1].displayOrder;
        });

        // get sorted titles and reasons, ensuring unique values
        const titles = sortedStatuses.map((s) => {
            return s.statusSeverityDescription;
        }).filter((value, index, self) => { return (self.indexOf(value) === index) });
        const reasons = sortedStatuses.map((s) => {
            return s.reason || null;
        }).filter((value, index, self) => { return (value !== null && self.indexOf(value) === index) });

        lineData.latestStatus.isDisrupted = sortedStatuses.reduce((value, status) => {
            if (severities[status.statusSeverity].disrupted) {
                value = true;
            }
            return value;
        }, false);
        lineData.latestStatus.title = titles.join("", "");
        lineData.latestStatus.shortTitle = titles.slice(0, 2).join("", "");
        lineData.latestStatus.descriptions = reasons;

        lineData.isDisrupted = lineData.latestStatus.isDisrupted;
        lineData.statusSummary = lineData.latestStatus.shortTitle;
    }

    return lineData;
};

const mutateData = (data) => {
    // work through all of the lines we want in order
    // and build up a JSON object of their statuses
    console.info("Manipulating result into preferred format");
    return TubeAlert.Lines.all().map((lineData) => {
        const lineStatus = data.find((status) => {
            return status.id === lineData.tflKey;
        });

        return addStatusData(lineData, lineStatus);
    });
};

const storeData = (data) => {
    console.log("Saving to DynamoDB");
    return TubeAlert.Data.storeStatus(now, data)
        .then(() => (data));
};

const getPreviousData = () => {
    console.log("Fetching previous data");
    return TubeAlert.Data.getLatestStatus(now)
        .then(data => {
            previousStatus = data;
        });
};

const getTflData = () => {
    console.info("Setting ENV variables");

    const TFL_APP_ID = process.env.TFL_APP_ID;
    const TFL_APP_KEY = process.env.TFL_APP_KEY;
    const TFL_HOST = "https://api.tfl.gov.uk";
    const TFL_PATH = "/Line/Mode/tube,dlr,tflrail,overground/Status" +
        "?app_id=" + TFL_APP_ID +
        "&app_key=" + TFL_APP_KEY;

    console.info("Fetching from TFL");
    return fetch(TFL_HOST + TFL_PATH).then(response => response.json());
};

const notifyUsers = (lineData) => {
    const lineID = lineData.urlKey;
    return TubeAlert.Data.getSubscriptionsStartingInLineSlot(lineID, now)
        .then(users => {
            console.log(users.length + " users to notify for " + lineData.name);
            const notifications = users.map(user => {
                const subscription = user.Subscription;
                return Notifications.send(subscription, lineData);
            });
            return Promise.all(notifications);
        });
};

const checkForNotifications = (data) => {
    if (previousStatus === null) {
        // don"t bother if we have nothing to compare
        console.log("No previous status for this tubeDate to check against");
        return;
    }
    console.log("Looking for lines that have changed");

    const brokenLines = [];

    data.forEach((line, key) => {
        const prevLine = previousStatus[key];
        if (line.urlKey !== prevLine.urlKey) {
            // feed out of order. get it next time round.
            return;
        }
        if (line.statusSummary !== prevLine.statusSummary) {
            console.log(line.name + " has changed");
            brokenLines.push(notifyUsers(line));
        }
    });
    return Promise.all(brokenLines);
};

exports.handler = (event, context, callback) => {

    now = Moment(new Date()).tz('Europe/London');

    getPreviousData()
        .then(getTflData)
        .then(mutateData)
        .then(storeData)
        .then(checkForNotifications)
        .then(() => {
            callback(null, "All done");
        })
        .catch(err => {
            console.error(err);
            callback("Failed to complete")
        });
};
