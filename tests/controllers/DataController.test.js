const DataController = require('../../src/controllers/DataController');

const mockDateTime = {
  toISOString: jest.fn(() => mockDateTime)
};
const defMockConverter = jest.fn();
const defMockDateTimeHelper = { getNow: jest.fn(() => mockDateTime) };
const defMockStatusModel = jest.fn();
const defMockSubscriptionModel = jest.fn();
const defMockNotificationModel = jest.fn();
const defMockLogger = { info: jest.fn(), error: jest.fn() };

const createController = (mockCallback, b, c, d, e, f, g) => new DataController(
  mockCallback,
  b || defMockConverter,
  c || defMockDateTimeHelper,
  d || defMockStatusModel,
  e || defMockSubscriptionModel,
  f || defMockNotificationModel,
  g || defMockLogger
);

test('fetchAction when no original status', () => {
  const mockGetAllMethod = jest.fn(() => new Promise(resolve => resolve([])));
  const mockFetchNewLatest = jest.fn();
  const mockCallback = jest.fn();

  const mockStatusModel = {
    getAllLatest: mockGetAllMethod,
    fetchNewLatest: mockFetchNewLatest,
  };

  const ctl = createController(mockCallback, null, null, mockStatusModel);

  return ctl.fetchAction()
    .then(() => {
      // assertions
      expect(mockGetAllMethod).toBeCalledWith(mockDateTime);
      expect(mockFetchNewLatest).toBeCalled();
      expect(mockCallback).toBeCalledWith(null, 'All done');
    });
});

test('fetchAction with error', () => {
  const mockGetAllMethod = jest.fn(() => new Promise((resolve, reject) => reject('Force an error')));
  const mockFetchNewLatest = jest.fn();
  const mockCallback = jest.fn();

  const mockStatusModel = {
    getAllLatest: mockGetAllMethod,
    fetchNewLatest: mockFetchNewLatest,
  };

  const ctl = createController(mockCallback, null, null, mockStatusModel);

  return ctl.fetchAction()
    .then(() => {
      // assertions
      expect(mockGetAllMethod).toBeCalledWith(mockDateTime);
      expect(mockFetchNewLatest).toBeCalled();
      expect(mockCallback).toBeCalledWith('Failed to complete');
    });
});

test('fetchAction creates notifications', () => {
  // data differences.
  // one line is the same in both
  // one line is in a different order
  // one line is different. This should result in one notification
  // a second line is different, so more subscriptions are returned (and merged into one list)
  const before = [
    { urlKey: 'one', statusSummary: 'ok1', name: 'One' },
    { urlKey: 'two', statusSummary: 'ok2', name: 'Two' },
    { urlKey: 'three', statusSummary: 'ok3', name: 'Three' },
    { urlKey: 'five', statusSummary: 'ok5', name: 'Five' },
  ];
  const after = [
    { urlKey: 'one', statusSummary: 'ok1', name: 'One' },
    { urlKey: 'four', statusSummary: 'ok4', name: 'Four' },
    { urlKey: 'three', statusSummary: 'notok3', name: 'Three' },
    { urlKey: 'five', statusSummary: 'notok5', name: 'Five' },
  ];

  const mockGetAllMethod = jest.fn(() => new Promise(resolve => resolve(before)));
  const mockFetchNewLatest = jest.fn(() => new Promise(resolve => resolve(after)));
  const mockCallback = jest.fn();
  const mockCreateNotificationsMethod = jest.fn();
  const mockNotificationModel = {
    createNotifications: mockCreateNotificationsMethod,
  };
  const mockSubscriptionsMethod = jest.fn((key) => {
    switch (key) {
      case 'three':
        return new Promise(resolve => resolve(['sub3']));
      case 'five':
        return new Promise(resolve => resolve(['sub5']));
      default:
        return null;
    }
  });
  const mockSubscriptionsModel = {
    getSubscriptionsForLineSlot: mockSubscriptionsMethod,
  };


  const mockStatusModel = {
    getAllLatest: mockGetAllMethod,
    fetchNewLatest: mockFetchNewLatest,
  };

  const ctl = createController(
    mockCallback,
    null,
    null,
    mockStatusModel,
    mockSubscriptionsModel,
    mockNotificationModel
  );

  return ctl.fetchAction()
    .then(() => {
      // assertions
      expect(mockSubscriptionsMethod.mock.calls[0][0]).toBe('three');
      expect(mockSubscriptionsMethod.mock.calls[0][1]).toBe(mockDateTime);
      expect(mockSubscriptionsMethod.mock.calls[1][0]).toBe('five');
      expect(mockSubscriptionsMethod.mock.calls[1][1]).toBe(mockDateTime);
      expect(mockCreateNotificationsMethod).toBeCalledWith([
        {
          lineData: { name: 'Three', urlKey: 'three', statusSummary: 'notok3' },
          subscription: 'sub3',
        },
        {
          lineData: { name: 'Five', urlKey: 'five', statusSummary: 'notok5' },
          subscription: 'sub5',
        },
      ]);
      expect(mockCallback).toBeCalledWith(null, 'All done');
    });
});

test('notifyAction when not an INSERT', () => {
  const mockCallback = jest.fn();
  const ctl = createController(mockCallback);
  ctl.notifyAction({
    Records: [
      { eventName: 'DELETE' },
    ],
  });
  expect(mockCallback).toBeCalledWith(null, 'Event was not an INSERT');
});

test('notifyAction when invalid', () => {
  const mockCallback = jest.fn();
  const ctl = createController(mockCallback);
  ctl.notifyAction({
    Records: [
      { eventName: 'INSERT', dynamodb: {} },
    ],
  });
  expect(mockCallback).toBeCalledWith(null, 'Event was not an INSERT');
});

test('notifyAction when error', () => {
  const mockCallback = jest.fn();
  const mockConverter = jest.fn(() => 'rowData');
  const mockDeleteNotificationMethod = jest.fn(() => new Promise((resolve, reject) => resolve()));
  const mockHandleNotificationMethod = jest.fn(() => new Promise((resolve, reject) => reject({
    statusCode : 500
  })));
  const mockNotificationModel = {
    handleNotification: mockHandleNotificationMethod,
  };
  const ctl = createController(
    mockCallback,
    mockConverter,
    null,
    null,
    null,
    mockNotificationModel
  );
  return ctl.notifyAction({
    Records: [
      { eventName: 'INSERT', dynamodb: { NewImage: 'bob' } },
    ],
  })
    .then(() => {
      expect(mockCallback).toBeCalledWith('Failed to complete');
    });
});

test('notifyAction when no longer exists', () => {
  const mockCallback = jest.fn();
  const mockConverter = jest.fn(() => {
    return {
      Subscription: {
        endpoint: 'endpointz'
      },
      NotificationID: "notID"
    }
  });
  const mockUnsubscribeMethod = jest.fn(() => new Promise((resolve, reject) => resolve()));
  const mockDeleteNotificationMethod = jest.fn(() => new Promise((resolve, reject) => resolve()));
  const mockHandleNotificationMethod = jest.fn(() => new Promise((resolve, reject) => reject({
    statusCode : 410
  })));
  const mockSubscriptionsModel = {
    unsubscribeUser: mockUnsubscribeMethod,
  };
  const mockNotificationModel = {
    handleNotification: mockHandleNotificationMethod,
    deleteNotification: mockDeleteNotificationMethod,
  };
  const ctl = createController(
    mockCallback,
    mockConverter,
    null,
    null,
    mockSubscriptionsModel,
    mockNotificationModel
  );
  return ctl.notifyAction({
    Records: [
      { eventName: 'INSERT', dynamodb: { NewImage: 'bob' } },
    ],
  })
    .then(() => {
      expect(mockUnsubscribeMethod.mock.calls[0][0]).toBe('endpointz');
      expect(mockDeleteNotificationMethod.mock.calls[0][0]).toBe('notID');
      expect(mockCallback).toBeCalledWith(null, 'All done');
    });
});

test('notifyAction handles notification', () => {
  const mockCallback = jest.fn();
  const mockConverter = jest.fn(() => 'rowData');
  const mockHandleNotificationMethod = jest.fn(() => new Promise(resolve => resolve()));
  const mockNotificationModel = {
    handleNotification: mockHandleNotificationMethod,
  };
  const ctl = createController(
    mockCallback,
    mockConverter,
    null,
    null,
    null,
    mockNotificationModel
  );
  return ctl.notifyAction({
    Records: [
      { eventName: 'INSERT', dynamodb: { NewImage: 'bob' } },
    ],
  })
    .then(() => {
      expect(mockConverter.mock.calls[0][0]).toEqual({ M: 'bob' });
      expect(mockHandleNotificationMethod.mock.calls[0][0]).toBe('rowData');
      expect(mockCallback).toBeCalledWith(null, 'All done');
    });
});

test('hourlyAction when error', () => {
  const mockCallback = jest.fn();
  const mockStatusModel = {
    getLatestDisrupted: () => new Promise((resolve, reject) => reject()),
  };

  const ctl = createController(mockCallback, null, null, mockStatusModel);
  return ctl.hourlyAction()
    .then(() => {
      expect(mockCallback).toBeCalledWith('Failed to complete');
    });
});

test('hourlyAction with no disruptions', () => {
  const mockCallback = jest.fn();
  const mockStatusModel = {
    getLatestDisrupted: () => new Promise(resolve => resolve([])),
  };

  const mockCreateNotificationsMethod = jest.fn();
  const mockNotificationModel = {
    createNotifications: mockCreateNotificationsMethod,
  };

  const ctl = createController(
    mockCallback,
    null,
    null,
    mockStatusModel,
    null,
    mockNotificationModel
  );
  return ctl.hourlyAction()
    .then(() => {
      expect(mockCreateNotificationsMethod).toBeCalledWith([]);
      expect(mockCallback).toBeCalledWith(null, 'All done');
    });
});

test('hourlyAction with notifications', () => {
  const mockCallback = jest.fn();
  const mockStatusModel = {
    getLatestDisrupted: () => new Promise(resolve => resolve([
      { urlKey: 'line1' },
      { urlKey: 'line2' },
    ])),
  };

  const mockCreateNotificationsMethod = jest.fn();
  const mockNotificationModel = {
    createNotifications: mockCreateNotificationsMethod,
  };

  const mockSubscriptionsMethod = jest.fn((key) => {
    switch (key) {
      case 'line1':
        return new Promise(resolve => resolve(['sub1']));
      case 'line2':
        return new Promise(resolve => resolve(['sub2']));
      default:
        return null;
    }
  });
  const mockSubscriptionsModel = {
    getSubscriptionsStartingInLineSlot: mockSubscriptionsMethod,
  };

  const ctl = createController(
    mockCallback,
    null,
    null,
    mockStatusModel,
    mockSubscriptionsModel,
    mockNotificationModel
  );
  return ctl.hourlyAction()
    .then(() => {
      expect(mockSubscriptionsMethod.mock.calls[0][0]).toEqual('line1');
      expect(mockSubscriptionsMethod.mock.calls[0][1]).toEqual(mockDateTime);
      expect(mockSubscriptionsMethod.mock.calls[1][0]).toEqual('line2');
      expect(mockSubscriptionsMethod.mock.calls[1][1]).toEqual(mockDateTime);

      expect(mockCreateNotificationsMethod.mock.calls[0][0]).toEqual([
        {
          lineData: { urlKey: 'line1' },
          subscription: 'sub1',
        },
        {
          lineData: { urlKey: 'line2' },
          subscription: 'sub2',
        },
      ]);
      expect(mockCallback).toBeCalledWith(null, 'All done');
    });
});
