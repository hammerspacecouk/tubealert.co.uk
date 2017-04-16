const Status = require('../../src/models/Status');

const defMockLogger = { info: jest.fn(), error: jest.fn() };
const defMockDateTimeHelper = {
  getTubeDate: () => 'tube-date',
  getNow: () => ({
    toISOString: () => 'iso',
    unix: () => 12345,
  }),
};
const defMockLineModel = { getSeverities: () => [] };
const defMockConfig = jest.fn();

test('getAllLatest returns result', () => {
  // setup mocks
  const mockQueryFunction = jest.fn(() => ({
    promise: () => new Promise(resolve => resolve({
      Items: [{
        Statuses: 'statuses',
      }],
    })),
  }));
  const mockDocumentClient = { query: mockQueryFunction };

  // setup and run model
  const model = new Status(
    mockDocumentClient,
    defMockDateTimeHelper,
    defMockLineModel,
    defMockConfig,
    defMockLogger,
  );
  return model.getAllLatest('now')
    .then((d) => {
      // assertions
      expect(
        mockQueryFunction.mock.calls[0][0].ExpressionAttributeValues[':date'],
      ).toBe('tube-date');
      expect(
        mockQueryFunction.mock.calls[0][0].ScanIndexForward,
      ).toBe(false);
      expect(d).toBe('statuses');
    });
});

test('getAllLatest returns empty result', () => {
  // setup mocks
  const mockQueryFunction = jest.fn(() => ({
    promise: () => new Promise(resolve => resolve({
      Items: [],
    })),
  }));
  const mockDocumentClient = { query: mockQueryFunction };

  // setup and run model
  const model = new Status(
    mockDocumentClient,
    defMockDateTimeHelper,
    defMockLineModel,
    defMockConfig,
    defMockLogger,
  );
  return model.getAllLatest('now')
    .then((d) => {
      // assertions
      expect(d).toEqual([]);
    });
});

test('getLatestDisrupted', () => {
  // setup mocks
  const mockQueryFunction = jest.fn(() => ({
    promise: () => new Promise(resolve => resolve({
      Items: [{
        Statuses: [
          { N: 1, isDisrupted: false },
          { N: 2, isDisrupted: true },
          { N: 3, isDisrupted: false },
        ],
      }],
    })),
  }));
  const mockDocumentClient = { query: mockQueryFunction };

  // setup and run model
  const model = new Status(
    mockDocumentClient,
    defMockDateTimeHelper,
    defMockLineModel,
    defMockConfig,
    defMockLogger,
  );
  return model.getLatestDisrupted('now')
    .then((result) => {
      expect(result).toEqual([{ N: 2, isDisrupted: true }]);
    });
});

test('fetch and store', () => {
  jest.mock('node-fetch');

  const mockLineModel = {
    getAll: () => [
      {
        name: 'Line1',
        tflKey: 'line1', // will be no information
      },
      {
        name: 'Line2',
        tflKey: 'line2', // one status, not disrupted
      },
      {
        name: 'Line3',
        tflKey: 'line3', // four statuses, must pick two unique and sorted
      },
    ],
    getSeverities: () => ({
      1: {
        title: 'Closed',
        disrupted: true,
        displayOrder: 1,
      },
      2: {
        title: 'Suspended',
        disrupted: true,
        displayOrder: 2,
      },
      10: {
        title: 'Good Service',
        disrupted: false,
        displayOrder: 100,
      },
    }),
  };

  const expectedData = [
    {
      name: 'Line1',
      updatedAt: 'iso',
      isDisrupted: null,
      statusSummary: 'No Information',
      latestStatus: {
        updatedAt: 'iso',
        isDisrupted: null,
        title: 'No Information',
        shortTitle: 'No Information',
        descriptions: null,
      },
    },
    {
      name: 'Line2',
      updatedAt: 'iso',
      isDisrupted: false,
      statusSummary: 'A',
      latestStatus: {
        updatedAt: 'iso',
        isDisrupted: false,
        title: 'A',
        shortTitle: 'A',
        descriptions: [
          'OK-A',
        ],
      },
    },
    {
      name: 'Line3',
      updatedAt: 'iso',
      isDisrupted: true,
      statusSummary: 'D, C',
      latestStatus: {
        updatedAt: 'iso',
        isDisrupted: true,
        title: 'D, C, B',
        shortTitle: 'D, C',
        descriptions: [
          'NOTOK-D1',
          'NOTOK-D2',
          'OK-B',
        ],
      },
    },
  ];

  const mockPutFunction = jest.fn(() => ({
    promise: () => new Promise(resolve => resolve()),
  }));
  const mockDocumentClient = { put: mockPutFunction };

  const model = new Status(
    mockDocumentClient,
    defMockDateTimeHelper,
    mockLineModel,
    defMockConfig,
    defMockLogger,
  );

  return model.fetchNewLatest()
    .then((result) => {
      expect(result).toEqual(expectedData);
      expect(mockPutFunction.mock.calls[0][0].Item.TubeDate).toBe('tube-date');
      expect(mockPutFunction.mock.calls[0][0].Item.Timestamp).toBe(12345);
      expect(mockPutFunction.mock.calls[0][0].Item.Statuses).toEqual(expectedData);
    });
});
