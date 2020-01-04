const Notification = require("../../src/models/Notification");

const defMockAssetManifest = {};
defMockAssetManifest["icon-key1.png"] = "image";
const defMockBatchWriteHelper = jest.fn();
const defMockWebPushHelper = jest.fn();
const defMockDocumentClient = jest.fn();
const defMockLogger = { info: jest.fn(), error: jest.fn() };
const defMockDateTime = {
  getNow: jest.fn(() => ({
    toISOString: () => "iso",
  })),
};
const defMockConfig = {
  STATIC_HOST: "STATIC_HOST/",
};

test("createNotifications when empty", () => {
  const model = new Notification(
    defMockDocumentClient,
    defMockWebPushHelper,
    defMockAssetManifest,
    defMockDateTime,
    defMockBatchWriteHelper,
    defMockConfig,
    defMockLogger
  );
  const result = model.createNotifications([]);
  expect(result).toBeNull();
});

test("createNotifications", () => {
  const mockMakeRequestsMethod = jest.fn(() => new Promise(resolve => resolve()));
  const mockBatchWriteHelper = jest.fn();
  mockBatchWriteHelper.prototype.makeRequests = mockMakeRequestsMethod;

  const model = new Notification(
    defMockDocumentClient,
    defMockWebPushHelper,
    defMockAssetManifest,
    defMockDateTime,
    mockBatchWriteHelper,
    defMockConfig,
    defMockLogger
  );
  return model
    .createNotifications([
      {
        lineData: {
          name: "Name1",
          statusSummary: "summary",
          urlKey: "key1",
        },
        subscription: {
          Subscription: "subscription",
        },
      },
    ])
    .then(() => {
      expect(mockMakeRequestsMethod.mock.calls[0][0].length).toBe(1);
      const item = mockMakeRequestsMethod.mock.calls[0][0][0].PutRequest.Item;
      expect(item.Subscription).toBe("subscription");
      expect(item.Payload).toEqual(
        JSON.stringify({
          title: "Name1",
          body: "summary",
          icon: "STATIC_HOST/image",
          tag: "/",
        })
      );
      expect(item.Created).toBe("iso");
    });
});

test("handleNotification", () => {
  // check webpush sends it
  const mockSendNotification = jest.fn(() => new Promise(resolve => resolve()));
  const mockWebPushHelper = {
    sendNotification: mockSendNotification,
  };

  // check it gets deleted
  const mockMakeRequestsMethod = jest.fn(() => new Promise(resolve => resolve()));
  const mockBatchWriteHelper = jest.fn();
  mockBatchWriteHelper.prototype.makeRequests = mockMakeRequestsMethod;

  const model = new Notification(
    defMockDocumentClient,
    mockWebPushHelper,
    defMockAssetManifest,
    defMockDateTime,
    mockBatchWriteHelper,
    defMockConfig,
    defMockLogger
  );
  return model
    .handleNotification({
      Payload: "payload",
      Subscription: "subscription",
      NotificationID: "notification1",
    })
    .then(() => {
      expect(mockSendNotification).toBeCalledWith("subscription", "payload");
      expect(mockMakeRequestsMethod).toBeCalledWith([
        {
          DeleteRequest: {
            Key: {
              NotificationID: "notification1",
            },
          },
        },
      ]);
    });
});
