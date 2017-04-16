"use strict";

const SubscriptionsController = require("../../src/controllers/SubscriptionsController");

const mockDateTimeHelper = { getNow: jest.fn(() => "now")};
const mockSubscriptionModel = jest.fn();
const mockLogger = {info: jest.fn(), error: jest.fn()};
const mockResponse = "response";
const mockCreateResponse = jest.fn(() => mockResponse);

const createController = (mockCallback, b, c, mockJsonResponse, f) => new SubscriptionsController(
    mockCallback,
    b || mockSubscriptionModel,
    c || mockDateTimeHelper,
    mockJsonResponse,
    f || mockLogger,
);

test("subscribeAction with error", () => {

    const mockCallback = jest.fn();
    const mockJsonResponse = { createErrorResponse: mockCreateResponse };
    const mockSubscriptionModel = {
        subscribeUser: () => new Promise((resolve, reject) => reject()),
    };

    const ctl = createController(mockCallback, mockSubscriptionModel, null, mockJsonResponse);
    return ctl.subscribeAction({
        body: "{}"
    })
        .then(() => {
            // assertions
            expect(mockCallback).toBeCalledWith(true, mockResponse);
        });
});

test("subscribeAction with succcess", () => {

    const mockCallback = jest.fn();
    const mockJsonResponse = { createResponse: mockCreateResponse };
    const mockSubscribeMethod = jest.fn(() => new Promise(resolve => resolve()));
    const mockSubscriptionModel = {
        subscribeUser: mockSubscribeMethod,
    };

    const ctl = createController(mockCallback, mockSubscriptionModel, null, mockJsonResponse);
    return ctl.subscribeAction({
        body: JSON.stringify({
            userID: "userID",
            lineID: "lineID",
            timeSlots: "timeSlots",
            subscription: "subscription"
        })
    })
        .then(() => {
            // assertions
            expect(mockSubscribeMethod).toBeCalledWith("userID", "lineID", "timeSlots", "subscription", "now");
            expect(mockCallback).toBeCalledWith(null, mockResponse);
        });
});


test("unsubscribeAction with error", () => {

    const mockCallback = jest.fn();
    const mockJsonResponse = { createErrorResponse: mockCreateResponse };
    const mockSubscriptionModel = {
        unsubscribeUser: () => new Promise((resolve, reject) => reject()),
    };

    const ctl = createController(mockCallback, mockSubscriptionModel, null, mockJsonResponse);
    return ctl.unsubscribeAction({
        body: "{}"
    })
        .then(() => {
            // assertions
            expect(mockCallback).toBeCalledWith(true, mockResponse);
        });
});

test("unsubscribeAction with success", () => {

    const mockCallback = jest.fn();
    const mockCreateResponse = jest.fn(() => mockResponse);
    const mockJsonResponse = { createResponse: mockCreateResponse };
    const mockUnsubscribeMethod = jest.fn(() => new Promise(resolve => resolve(42)));
    const mockSubscriptionModel = {
        unsubscribeUser: mockUnsubscribeMethod,
    };

    const ctl = createController(mockCallback, mockSubscriptionModel, null, mockJsonResponse);
    return ctl.unsubscribeAction({
        body: JSON.stringify({
            userID: "userID"
        })
    })
        .then(() => {
            // assertions
            expect(mockUnsubscribeMethod).toBeCalledWith("userID");
            expect(mockCreateResponse).toBeCalledWith({
                status : "success",
                removed : 42
            });
            expect(mockCallback).toBeCalledWith(null, mockResponse);
        });
});

