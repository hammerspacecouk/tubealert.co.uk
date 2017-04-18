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
    (evt, ctx, cb) => Controllers.webapp(cb).invokeAction(evt),
};
