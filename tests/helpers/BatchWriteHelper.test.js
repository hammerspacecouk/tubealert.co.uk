const BatchWriteHelper = require("../../src/helpers/BatchWriteHelper");

const mockLogger = { info: jest.fn(), error: jest.fn() };
const TABLE_NAME = "TABLE_NAME";

test("small batch", () => {
  const mockWriteFunction = jest.fn(() => ({
    promise: () => new Promise(resolve => resolve({})),
  }));
  const mockDocumentClient = { batchWrite: mockWriteFunction };

  const helper = new BatchWriteHelper(mockDocumentClient, TABLE_NAME, mockLogger);

  const inputData = [1, 2];

  return helper.makeRequests(inputData).then(result => {
    expect(result).toBe(2);

    expect(mockWriteFunction.mock.calls[0][0]).toEqual({
      RequestItems: {
        TABLE_NAME: inputData,
      },
    });
  });
});

test("handles failed items", () => {
  const mockWriteFunction = jest.fn();
  mockWriteFunction
    .mockReturnValueOnce({
      promise: () => new Promise(resolve => resolve({ UnprocessedItems: { TABLE_NAME: [2] } })),
    })
    .mockReturnValueOnce({
      promise: () => new Promise(resolve => resolve({})),
    });

  const mockDocumentClient = { batchWrite: mockWriteFunction };

  const helper = new BatchWriteHelper(mockDocumentClient, TABLE_NAME, mockLogger);

  const inputData = [1, 2];

  return helper.makeRequests(inputData).then(result => {
    expect(result).toBe(2);

    expect(mockWriteFunction.mock.calls[0][0]).toEqual({
      RequestItems: {
        TABLE_NAME: inputData,
      },
    });
    expect(mockWriteFunction.mock.calls[1][0]).toEqual({
      RequestItems: {
        TABLE_NAME: [2],
      },
    });
  });
});

test("recurse until complete", () => {
  const mockWriteFunction = jest.fn(() => ({
    promise: () => new Promise(resolve => resolve({})),
  }));
  const mockDocumentClient = { batchWrite: mockWriteFunction };

  const helper = new BatchWriteHelper(mockDocumentClient, TABLE_NAME, mockLogger);

  const inputData = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    52,
  ];

  return helper.makeRequests(inputData).then(result => {
    expect(result).toBe(52);

    expect(mockWriteFunction.mock.calls[0][0]).toEqual({
      RequestItems: {
        TABLE_NAME: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
      },
    });
    expect(mockWriteFunction.mock.calls[1][0]).toEqual({
      RequestItems: {
        TABLE_NAME: [
          26,
          27,
          28,
          29,
          30,
          31,
          32,
          33,
          34,
          35,
          36,
          37,
          38,
          39,
          40,
          41,
          42,
          43,
          44,
          45,
          46,
          47,
          48,
          49,
          50,
        ],
      },
    });
    expect(mockWriteFunction.mock.calls[2][0]).toEqual({
      RequestItems: {
        TABLE_NAME: [51, 52],
      },
    });
  });
});
