

const TimeSlotsHelper = require('../../src/helpers/TimeSlotsHelper');

test("deletes don't include existing", () => {
  const oldData = [
    null,
    [null, null, true],
    [true, null, null],
  ];
  const newData = [
    { UserID: 1, LineSlot: '0102', Day: 1, Hour: 2 }, // still exists, shouldn't appear
    { UserID: 2, LineSlot: '0203', Day: 2, Hour: 3 }, // doesn't exist, should be marked for delete
    { UserID: 3, LineSlot: '0204', Day: 2, Hour: 4 }, // doesn't exist, should be marked for delete
  ];

  const helper = new TimeSlotsHelper(oldData);
  const result = helper.getDeletes(newData);

  expect(result).toEqual([
    { DeleteRequest: { Key: { UserID: 2, LineSlot: '0203' } } },
    { DeleteRequest: { Key: { UserID: 3, LineSlot: '0204' } } },
  ]);
});


test('make puts', () => {
  const data = [
    null, // no sunday, so it should be skipped without error,
    [false, false, false, false, false, false, false, false,
      false, false, false, false, false, false, false, false,
      false, false, false, false, false, false, false, false, true], // 25th hour, should be ignored
    [false, true, false, true, true, true, false], // has data, including a window from 3 - 5
    null,
    null,
    null,
    null,
    [true], // day 8 (should be ignore)
  ];
  const helper = new TimeSlotsHelper(data);
  const nowMock = {
    toISOString: () => 'now',
  };
  const result = helper.getPuts(
    { endpoint: 'endpoint' },
    'line',
    nowMock
  );

  expect(result).toEqual([
    {
      PutRequest: {
        Item: {
          UserID: 'endpoint',
          LineSlot: 'line_0201',
          Line: 'line',
          Day: 2,
          Hour: 1,
          WindowStart: 1,
          Created: 'now',
          Subscription: { endpoint: 'endpoint' },
        },
      },
    },
    {
      PutRequest: {
        Item: {
          UserID: 'endpoint',
          LineSlot: 'line_0203',
          Line: 'line',
          Day: 2,
          Hour: 3,
          WindowStart: 3,
          Created: 'now',
          Subscription: { endpoint: 'endpoint' },
        },
      },
    },
    {
      PutRequest: {
        Item: {
          UserID: 'endpoint',
          LineSlot: 'line_0204',
          Line: 'line',
          Day: 2,
          Hour: 4,
          WindowStart: 3,
          Created: 'now',
          Subscription: { endpoint: 'endpoint' },
        },
      },
    },
    {
      PutRequest: {
        Item: {
          UserID: 'endpoint',
          LineSlot: 'line_0205',
          Line: 'line',
          Day: 2,
          Hour: 5,
          WindowStart: 3,
          Created: 'now',
          Subscription: { endpoint: 'endpoint' },
        },
      },
    },
  ]);
});
