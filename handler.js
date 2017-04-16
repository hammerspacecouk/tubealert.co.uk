const Controllers = require('./src/DI').controllers;

// handlers
module.exports = {
  latest:
    (evt, ctx, cb) => Controllers.status(cb).latestAction(),
  subscribe:
    (evt, ctx, cb) => Controllers.subscriptions(cb).subscribeAction(evt),
  unsubscribe:
    (evt, ctx, cb) => Controllers.subscriptions(cb).unsubscribeAction(evt),
  fetch:
    (evt, ctx, cb) => Controllers.data(cb).fetchAction(),
  hourly:
    (evt, ctx, cb) => Controllers.data(cb).hourlyAction(),
  notify:
    (evt, ctx, cb) => Controllers.data(cb).notifyAction(evt),
  webapp:
    (evt, ctx, cb) => {
      const response = {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Go Serverless v1.0! Your function executed successfully!',
          input: evt,
        }),
      };
      cb(null, response);
    },
};
