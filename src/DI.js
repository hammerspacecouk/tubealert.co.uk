'use strict';

// config


// dependencies
const AWS = require("aws-sdk");
const Moment = require("moment-timezone");

// controllers
const AllController = require("./controllers/AllController");

// helpers
const JsonResponseHelper = require("./helpers/JsonResponseHelper");
const DateTimeHelper = require("./helpers/DateTimeHelper");

// models
const Status = require("./models/Status");

// global fixed state
const documentClient = new AWS.DynamoDB.DocumentClient({region: "eu-west-2"});

// constructors
const getDateTimeHelper = () => {
    return new DateTimeHelper(Moment(new Date()).tz('Europe/London'));
};
const getStatus = () => {
    return new Status(
        documentClient,
        getDateTimeHelper(),
        console
    );
};

const getAllController = (callback) => {
    return new AllController(
        callback,
        getDateTimeHelper(),
        getStatus(),
        JsonResponseHelper,
        console
    );
};

module.exports = {
    models: {
        status: getStatus
    },
    controllers: {
        all: getAllController
    },
    helpers: {
        dateTime: getDateTimeHelper
    }
};