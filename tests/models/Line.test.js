const Line = require('../../src/models/Line');

test('getters', () => {
  const lines = Line.getAll();
  const severities = Line.getSeverities();

  expect(lines).toBeInstanceOf(Array);
  expect(typeof severities).toEqual('object');
});
