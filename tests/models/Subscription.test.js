"use strict";

const Subscription = require("../../src/models/Subscription");

const mockBatchWriteHelper = jest.fn();
const mockTimeSlotsHelper = jest.fn();
const mockDocumentClient = jest.fn();
const mockLogger = {info: jest.fn(), error: jest.fn()};

test("something", () => {
    new Subscription(mockDocumentClient, mockBatchWriteHelper, mockTimeSlotsHelper, mockLogger);
});
