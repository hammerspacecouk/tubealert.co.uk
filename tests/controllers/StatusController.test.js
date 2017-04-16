const StatusController = require('../../src/controllers/StatusController');

const mockLogger = { info: jest.fn(), error: jest.fn() };
const mockResponse = 'response';
const mockCreateResponse = jest.fn(() => mockResponse);
const mockDateTime = { getNow: jest.fn(() => 'now') };

test('returns result', () => {
  // setup mocks
  const mockJsonResponse = { createResponse: mockCreateResponse };
  const mockCallback = jest.fn();

  const mockGetLatest = jest.fn(() => new Promise(resolve => resolve('data')));
  const mockStatus = { getAllLatest: mockGetLatest };

  // setup and run controller
  const controller = new StatusController(
    mockCallback,
    mockDateTime,
    mockStatus,
    mockJsonResponse,
    mockLogger
  );
  return controller.latestAction()
    .then(() => {
      // assertions
      expect(mockGetLatest).toBeCalledWith('now');
      expect(mockCreateResponse).toBeCalledWith('data');
      expect(mockCallback).toBeCalledWith(null, mockResponse);
    });
});

test('returns error', () => {
  // setup mocks
  const mockJsonResponse = { createErrorResponse: mockCreateResponse };
  const mockCallback = jest.fn();

  const mockGetLatest = jest.fn(() => new Promise((resolve, reject) => reject('failure')));
  const mockStatus = { getAllLatest: mockGetLatest };

  // setup and run controller
  const controller = new StatusController(
    mockCallback,
    mockDateTime,
    mockStatus,
    mockJsonResponse,
    mockLogger
  );
  return controller.latestAction()
    .then(() => {
      // assertions
      expect(mockGetLatest).toBeCalledWith('now');
      expect(mockCreateResponse).toBeCalledWith('data');
      expect(mockCallback).toBeCalledWith(true, mockResponse);
    });
});
