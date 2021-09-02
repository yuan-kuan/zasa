import test from 'ava';

import { makeStartEndRangeAllDocOption } from './db_ops';

test('start end option for anything', async (t) => {
  const option = makeStartEndRangeAllDocOption('k');

  t.deepEqual(option, { startkey: 'k', endkey: 'k\ufff0', include_docs: true });
});
