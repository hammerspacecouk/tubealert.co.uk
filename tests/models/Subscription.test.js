const Subscription = require("../../src/models/Subscription");

const defMockBatchWriteHelper = jest.fn();
const defMockTimeSlotsHelper = jest.fn();
const defMockLogger = { info: jest.fn(), error: jest.fn() };

test("subscribe user", () => {
  // setup mocks
  const mockQueryFunction = jest.fn(() => ({
    promise: () =>
      new Promise(resolve =>
        resolve({
          Items: [1, 2, 3],
        })
      ),
  }));
  const mockDocumentClient = { query: mockQueryFunction };

  const mockMakeRequestsMethod = jest.fn();
  const mockBatchWriteHelper = jest.fn();
  mockBatchWriteHelper.prototype.makeRequests = mockMakeRequestsMethod;

  const mockGetPutsMethod = jest.fn(() => [1, 2]);
  const mockGetDeletesMethod = jest.fn(() => [4]);
  const mockTimeSlotsHelper = jest.fn();
  mockTimeSlotsHelper.prototype.getPuts = mockGetPutsMethod;
  mockTimeSlotsHelper.prototype.getDeletes = mockGetDeletesMethod;

  const model = new Subscription(mockDocumentClient, mockBatchWriteHelper, mockTimeSlotsHelper, defMockLogger);
  return model.subscribeUser("userID1", "lineID1", "timeslots", "subscription1", "now").then(() => {
    expect(mockGetPutsMethod).toBeCalledWith("subscription1", "lineID1", "now");
    expect(mockGetDeletesMethod).toBeCalledWith([1, 2, 3]);
    expect(mockQueryFunction).toBeCalledWith({
      TableName: "tubealert.co.uk_subscriptions",
      KeyConditionExpression: "#user = :user",
      ExpressionAttributeNames: {
        "#line": "Line",
        "#user": "UserID",
      },
      ExpressionAttributeValues: {
        ":line": "lineID1",
        ":user": "userID1",
      },
      FilterExpression: "#line = :line",
    });
    expect(mockMakeRequestsMethod).toBeCalledWith([4, 1, 2]);
  });
});

test("unsubscribe user", () => {
  // setup mocks
  const mockQueryFunction = jest.fn(() => ({
    promise: () =>
      new Promise(resolve =>
        resolve({
          Items: [
            {
              UserID: "userID1",
              LineSlot: "slot1",
            },
            {
              UserID: "userID1",
              LineSlot: "slot2",
            },
          ],
        })
      ),
  }));
  const mockDocumentClient = { query: mockQueryFunction };

  const mockMakeRequestsMethod = jest.fn();
  const mockBatchWriteHelper = jest.fn();
  mockBatchWriteHelper.prototype.makeRequests = mockMakeRequestsMethod;

  const model = new Subscription(mockDocumentClient, mockBatchWriteHelper, defMockTimeSlotsHelper, defMockLogger);
  return model.unsubscribeUser("userID1").then(() => {
    expect(mockQueryFunction).toBeCalledWith({
      TableName: "tubealert.co.uk_subscriptions",
      KeyConditionExpression: "#user = :user",
      ExpressionAttributeNames: {
        "#user": "UserID",
      },
      ExpressionAttributeValues: {
        ":user": "userID1",
      },
    });
    expect(mockMakeRequestsMethod).toBeCalledWith([
      {
        DeleteRequest: {
          Key: {
            UserID: "userID1",
            LineSlot: "slot1",
          },
        },
      },
      {
        DeleteRequest: {
          Key: {
            UserID: "userID1",
            LineSlot: "slot2",
          },
        },
      },
    ]);
  });
});

test("getSubscriptionsForLineSlot", () => {
  // setup mocks
  const mockQueryFunction = jest.fn(() => ({
    promise: () =>
      new Promise(resolve =>
        resolve({
          Items: "the result",
        })
      ),
  }));
  const mockDocumentClient = { query: mockQueryFunction };

  const model = new Subscription(mockDocumentClient, defMockBatchWriteHelper, defMockTimeSlotsHelper, defMockLogger);

  const mockDate = {
    day: () => 4,
    format: format => (format === "HH" ? "03" : null),
  };

  return model.getSubscriptionsForLineSlot("line1", mockDate).then(result => {
    expect(result).toBe("the result");
    expect(mockQueryFunction).toBeCalledWith({
      TableName: "tubealert.co.uk_subscriptions",
      IndexName: "index_lineSlot",
      KeyConditionExpression: "#line = :line",
      ExpressionAttributeNames: {
        "#line": "LineSlot",
      },
      ExpressionAttributeValues: {
        ":line": "line1_0403",
      },
    });
  });
});

test("getSubscriptionsStartingInLineSlot", () => {
  // setup mocks
  const mockQueryFunction = jest.fn(() => ({
    promise: () =>
      new Promise(resolve =>
        resolve({
          Items: "the result",
        })
      ),
  }));
  const mockDocumentClient = { query: mockQueryFunction };

  const model = new Subscription(mockDocumentClient, defMockBatchWriteHelper, defMockTimeSlotsHelper, defMockLogger);

  const mockDate = {
    day: () => 4,
    hours: () => 3,
    format: format => (format === "HH" ? "03" : null),
  };

  return model.getSubscriptionsStartingInLineSlot("line1", mockDate).then(result => {
    expect(result).toBe("the result");
    expect(mockQueryFunction).toBeCalledWith({
      TableName: "tubealert.co.uk_subscriptions",
      IndexName: "index_lineSlot",
      KeyConditionExpression: "#line = :line",
      FilterExpression: "#start = :start",
      ExpressionAttributeNames: {
        "#line": "LineSlot",
        "#start": "WindowStart",
      },
      ExpressionAttributeValues: {
        ":line": "line1_0403",
        ":start": 3,
      },
    });
  });
});
