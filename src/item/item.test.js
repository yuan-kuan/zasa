import test from 'ava';
import { addBatch, makeBatchDoc, makeItemDoc } from './item_utils';

test('Item with single word', async (t) => {
  const item = makeItemDoc('Single', 'abcd');

  t.deepEqual(item._id, 'single-abcd');
  t.deepEqual(item.name, 'Single');
});

test('Item with two and three words', async (t) => {
  const item2 = makeItemDoc('dOuble do', '02');
  const item3 = makeItemDoc('TiplE Tri iRR', '0202');

  t.deepEqual(item2._id, 'double-do-02');
  t.deepEqual(item2.name, 'dOuble do');

  t.deepEqual(item3._id, 'tiple-tri-irr-0202');
  t.deepEqual(item3.name, 'TiplE Tri iRR');
});

test('Name with spaces in front or back will be trim', async (t) => {
  const item = makeItemDoc('  space space ', 'ad12');

  t.deepEqual(item._id, 'space-space-ad12');
  t.deepEqual(item.name, 'space space');
});

test('Batch create with item id and YMD, start with 0 count', async (t) => {
  const batch = makeBatchDoc('abc_cba', new Date('2020-04-27T01:00:00'));

  t.deepEqual(batch.type, 'b');
  t.deepEqual(batch._id, 'abc_cba:20200427');
  t.deepEqual(batch.expiry, 20200427);
  t.deepEqual(batch.count, 0);
});

test('Increment Batch', async (t) => {
  const batch = makeBatchDoc('abc_cba', new Date('2020-01-01T01:00:00'));
  let incBatch = addBatch(2, batch);

  t.deepEqual(incBatch.type, 'b');
  t.deepEqual(incBatch._id, 'abc_cba:20200101');
  t.deepEqual(incBatch.expiry, 20200101);
  t.deepEqual(incBatch.count, 2);
});

test('Decrement Batch', async (t) => {
  const batch = makeBatchDoc('abc_cba', new Date('2020-01-01T01:00:00'));
  let incBatch = addBatch(2, batch);
  let decBatch = addBatch(-1, incBatch);

  t.deepEqual(decBatch.type, 'b');
  t.deepEqual(decBatch._id, 'abc_cba:20200101');
  t.deepEqual(decBatch.expiry, 20200101);
  t.deepEqual(decBatch.count, 1);
});
