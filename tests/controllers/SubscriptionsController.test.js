const SubscriptionsController = require("../../src/controllers/SubscriptionsController");

const defMockDateTimeHelper = { getNow: jest.fn(() => "now") };
const defMockSubscriptionModel = jest.fn();
const defMockLogger = { info: jest.fn(), error: jest.fn() };
const defMockResponse = "response";
const defMockCreateResponse = jest.fn(() => defMockResponse);

const createController = (mockCallback, b, c, mockJsonResponse, f) =>
  new SubscriptionsController(
    mockCallback,
    b || defMockSubscriptionModel,
    c || defMockDateTimeHelper,
    mockJsonResponse,
    f || defMockLogger
  );

test("subscribeAction with error", () => {
  const mockCallback = jest.fn();
  const mockJsonResponse = { createErrorResponse: defMockCreateResponse };
  const mockSubscriptionModel = {
    subscribeUser: () => new Promise((resolve, reject) => reject()),
  };

  const ctl = createController(mockCallback, mockSubscriptionModel, null, mockJsonResponse);
  return ctl
    .subscribeAction({
      body: "{}",
    })
    .then(() => {
      // assertions
      expect(mockCallback).toBeCalledWith(true, defMockResponse);
    });
});

test("subscribeAction with success", () => {
  const mockCallback = jest.fn();
  const mockJsonResponse = { createResponse: defMockCreateResponse };
  const mockSubscribeMethod = jest.fn(() => new Promise(resolve => resolve()));
  const mockSubscriptionModel = {
    subscribeUser: mockSubscribeMethod,
  };

  const ctl = createController(mockCallback, mockSubscriptionModel, null, mockJsonResponse);
  return ctl
    .subscribeAction({
      body: JSON.stringify({
        userID: "userID",
        lineID: "lineID",
        timeSlots: "timeSlots",
        subscription: "subscription",
      }),
    })
    .then(() => {
      // assertions
      expect(mockSubscribeMethod).toBeCalledWith("userID", "lineID", "timeSlots", "subscription", "now");
      expect(mockCallback).toBeCalledWith(null, defMockResponse);
    });
});

test("unsubscribeAction with error", () => {
  const mockCallback = jest.fn();
  const mockJsonResponse = { createErrorResponse: defMockCreateResponse };
  const mockSubscriptionModel = {
    unsubscribeUser: () => new Promise((resolve, reject) => reject()),
  };

  const ctl = createController(mockCallback, mockSubscriptionModel, null, mockJsonResponse);
  return ctl
    .unsubscribeAction({
      body: "{}",
    })
    .then(() => {
      // assertions
      expect(mockCallback).toBeCalledWith(true, defMockResponse);
    });
});

test("unsubscribeAction with success", () => {
  const mockCallback = jest.fn();
  const mockCreateResponse = jest.fn(() => defMockResponse);
  const mockJsonResponse = { createResponse: mockCreateResponse };
  const mockUnsubscribeMethod = jest.fn(() => new Promise(resolve => resolve(42)));
  const mockSubscriptionModel = {
    unsubscribeUser: mockUnsubscribeMethod,
  };

  const ctl = createController(mockCallback, mockSubscriptionModel, null, mockJsonResponse);
  return ctl
    .unsubscribeAction({
      body: JSON.stringify({
        userID: "userID",
      }),
    })
    .then(() => {
      // assertions
      expect(mockUnsubscribeMethod).toBeCalledWith("userID");
      expect(mockCreateResponse).toBeCalledWith({
        status: "success",
        removed: 42,
      });
      expect(mockCallback).toBeCalledWith(null, defMockResponse);
    });
});
