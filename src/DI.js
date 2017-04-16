// config
const assetManifest = require('../assets-manifest.json');

// dependencies (note AWS is already installed in Lambda environment)
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
const AWS = require('aws-sdk');
const Moment = require('moment-timezone');
const WebPush = require('web-push');

// controllers
const DataController = require('./controllers/DataController');
const StatusController = require('./controllers/StatusController');
const SubscriptionsController = require('./controllers/SubscriptionsController');

// helpers
const BatchWriteHelper = require('./helpers/BatchWriteHelper');
const DateTimeHelper = require('./helpers/DateTimeHelper');
const JsonResponseHelper = require('./helpers/JsonResponseHelper');
const TimeSlotsHelper = require('./helpers/TimeSlotsHelper');

// models
const Line = require('./models/Line');
const Notification = require('./models/Notification');
const Status = require('./models/Status');
const Subscription = require('./models/Subscription');

// global fixed state
const documentClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-2' });
const config = {
  TFL_APP_ID: process.env.TFL_APP_ID,
  TFL_APP_KEY: process.env.TFL_APP_KEY,
  STATIC_HOST: process.env.STATIC_HOST,
};
WebPush.setGCMAPIKey(process.env.GCM_API_KEY);
WebPush.setVapidDetails(
  `mailto:${process.env.CONTACT_EMAIL}`,
  process.env.PUBLIC_KEY,
  process.env.PRIVATE_KEY
);

// constructors
const getDateTimeHelper = () => new DateTimeHelper(Moment(new Date()).tz('Europe/London'));
const getLineModel = () => Line;
const getNotificationModel = () => new Notification(
    documentClient,
    WebPush,
    assetManifest,
    getDateTimeHelper(),
    BatchWriteHelper,
    config,
    console
  );
const getStatusModel = () => new Status(
    documentClient,
    getDateTimeHelper(),
    getLineModel(),
    config,
    console
  );
const getSubscriptionModel = () => new Subscription(
    documentClient,
    BatchWriteHelper,
    TimeSlotsHelper,
    console
  );

const getDataController = callback => new DataController(
    callback,
    AWS.DynamoDB.Converter.output,
    getDateTimeHelper(),
    getStatusModel(),
    getSubscriptionModel(),
    getNotificationModel(),
    console
  );

const getStatusController = callback => new StatusController(
    callback,
    getDateTimeHelper(),
    getStatusModel(),
    JsonResponseHelper,
    console
  );

const getSubscriptionsController = callback => new SubscriptionsController(
    callback,
    getSubscriptionModel(),
    getDateTimeHelper(),
    JsonResponseHelper,
    console
  );

module.exports = {
  controllers: {
    data: getDataController,
    status: getStatusController,
    subscriptions: getSubscriptionsController,
  },
};
