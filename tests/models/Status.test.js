"use strict";

const Status = require("../../src/models/Status");
const mockLogger = {info: jest.fn(), error: jest.fn()};
const mockDateTimeHelper = { getTubeDate: () => "tube-date" };

test('stores result', () => {
    // setup mocks
    const mockPutFunction = jest.fn(() => {
        return {
            promise : () => "result"
        }
    });
    const mockDocumentClient = { put: mockPutFunction };

    // setup and run controller
    const model = new Status(mockDocumentClient, mockDateTimeHelper, mockLogger);
    const result = model.storeStatus(
        {unix: () => 12345},
        "data"
    );
    expect(result).toBe("result");
    expect(mockPutFunction.mock.calls[0][0].Item.TubeDate).toBe("tube-date");
    expect(mockPutFunction.mock.calls[0][0].Item.Timestamp).toBe(12345);
    expect(mockPutFunction.mock.calls[0][0].Item.Statuses).toBe("data");
});

test('returns result', () => {
    // setup mocks
    const mockQueryFunction = jest.fn(() => {
        return {
            promise : () => new Promise((resolve) => resolve({
                Items : [{
                    Statuses : "statues"
                }]
            }))
        }
    });
    const mockDocumentClient = { query: mockQueryFunction };

    // setup and run controller
    const model = new Status(mockDocumentClient, mockDateTimeHelper, mockLogger);
    return model.getAllLatest("now")
        .then(d => {
            // assertions
            expect(
                mockQueryFunction.mock.calls[0][0].ExpressionAttributeValues[":date"]
            ).toBe("tube-date");
            expect(
                mockQueryFunction.mock.calls[0][0].ScanIndexForward
            ).toBe(false);
            expect(d).toBe("statues");
        });
});

test('returns empty result', () => {
    // setup mocks
    const mockQueryFunction = jest.fn(() => {
        return {
            promise : () => new Promise((resolve) => resolve({
                Items : []
            }))
        }
    });
    const mockDocumentClient = { query: mockQueryFunction };

    // setup and run controller
    const model = new Status(mockDocumentClient, mockDateTimeHelper, mockLogger);
    model.getAllLatest("now")
        .then(d=>d).catch(e=>console.log(e)).then(d => {
        // assertions
        expect(d).toBe(null);
    });
});