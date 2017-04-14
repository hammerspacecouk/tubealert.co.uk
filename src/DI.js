'use strict';

// config


// dependencies
const AWS = require("aws-sdk");
const Moment = require("moment-timezone");

// controllers
const StatusController = require("./controllers/StatusController");
const SubscriptionsController = require("./controllers/SubscriptionsController");

// helpers
const JsonResponseHelper = require("./helpers/JsonResponseHelper");
const DateTimeHelper = require("./helpers/DateTimeHelper");

// models
const Status = require("./models/Status");
const Subscription = require("./models/Subscription");

// global fixed state
const documentClient = new AWS.DynamoDB.DocumentClient({region: "eu-west-2"});

// constructors
const getDateTimeHelper = () => {
    return new DateTimeHelper(Moment(new Date()).tz('Europe/London'));
};
const getStatusModel = () => {
    return new Status(
        documentClient,
        getDateTimeHelper(),
        console
    );
};
const getSubscriptionModel = () => {
    return new Subscription(
        documentClient,
        console
    );
};

const getStatusController = (callback) => {
    return new StatusController(
        callback,
        getDateTimeHelper(),
        getStatusModel(),
        JsonResponseHelper,
        console
    );
};

const getSubscriptionsController = (callback) => {
    return new SubscriptionsController(
        callback,
        getSubscriptionModel(),
        JsonResponseHelper,
        console
    );
};

module.exports = {
    controllers: {
        status: getStatusController,
        subscriptions: getSubscriptionsController
    }
};