import { makeStartEndRangeAllDocOption } from './db_ops';

test('start end option for anything', () => {
  const option = makeStartEndRangeAllDocOption('k');
  expect(option).toEqual({ startkey: 'k', endkey: 'k\ufff0', include_docs: true });
});
