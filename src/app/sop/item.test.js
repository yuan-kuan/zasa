import test from 'ava';
import {
  addBatch,
  makeBatchDoc,
  makeItemDoc,
  addTag,
  removeTag,
} from './item_utils';

test('Item with single word', async (t) => {
  const item = makeItemDoc('Single', 'abcd');

  t.deepEqual(item._id, 'i_single-abcd');
  t.deepEqual(item.name, 'Single');
});

test('Item with two and three words', async (t) => {
  const item2 = makeItemDoc('dOuble do', '02');
  const item3 = makeItemDoc('TiplE Tri iRR', '0202');

  t.deepEqual(item2._id, 'i_double-do-02');
  t.deepEqual(item2.name, 'dOuble do');

  t.deepEqual(item3._id, 'i_tiple-tri-irr-0202');
  t.deepEqual(item3.name, 'TiplE Tri iRR');
});

test('Name with spaces in front or back will be trim', async (t) => {
  const item = makeItemDoc('  space space ', 'ad12');

  t.deepEqual(item._id, 'i_space-space-ad12');
  t.deepEqual(item.name, 'space space');
});

test('Batch create with item id and YMD, start with 0 count', async (t) => {
  const expiry = new Date('2020-04-27T01:00:00');
  const remindDays = 30;
  const remindDate = new Date('2020-05-27T01:00:00');
  const batch = makeBatchDoc('i_abc_cba', expiry, remindDays);

  t.deepEqual(batch.type, 'b');
  t.deepEqual(batch._id, 'b_abc_cba:20200427');
  t.deepEqual(batch.expiry, expiry.valueOf());
  t.deepEqual(batch.remind, remindDate.valueOf());
  t.deepEqual(batch.count, 0);
});

test('Increment Batch', async (t) => {
  const d = new Date('2020-01-01T01:00:00');
  const batch = makeBatchDoc('i_abc_cba', d, 30);
  let incBatch = addBatch(2, batch);

  t.deepEqual(incBatch._id, 'b_abc_cba:20200101');
  t.deepEqual(incBatch.count, 2);
});

test('Decrement Batch', async (t) => {
  const batch = makeBatchDoc('i_abc_cba', new Date('2020-01-01T01:00:00'), 30);
  let incBatch = addBatch(2, batch);
  let decBatch = addBatch(-1, incBatch);

  t.deepEqual(decBatch._id, 'b_abc_cba:20200101');
  t.deepEqual(decBatch.count, 1);
});

test('Update Batch remind date', async (t) => {
  const expiry = new Date('2020-01-01T01:00:00');
  const batch = makeBatchDoc('i_abc_cba', expiry, 30);
  let updatedBatch = updateRemindDay(14, batch);

  const newRemind = new Date('2020-01-15T01:00:00');

  t.deepEqual(updatedBatch.expiry, expiry.valueOf());
  t.deepEqual(updatedBatch.remind, newRemind.valueOf());
});

test('Add a new tag to item', async (t) => {
  const item = makeItemDoc('with new tag', 'bo');
  const taggedItem = addTag('shiny', item);

  t.deepEqual(taggedItem.tags, ['shiny']);
});

test('tags and ordered ascending', async (t) => {
  const item = makeItemDoc('with new tag', 'bo');
  const taggedItem = addTag('shiny', item);
  const taggedTwiceItem = addTag('freshy', taggedItem);
  const taggedThriceItem = addTag('lovely', taggedTwiceItem);

  t.deepEqual(taggedItem.tags, ['shiny']);
  t.deepEqual(taggedTwiceItem.tags, ['freshy', 'shiny']);
  t.deepEqual(taggedThriceItem.tags, ['freshy', 'lovely', 'shiny']);
});

test('remove tag kept order', async (t) => {
  const item = makeItemDoc('with new tag', 'bo');
  const taggedItem = addTag('shiny', addTag('freshy', addTag('lovely', item)));
  const lessTaggedItem = removeTag('lovely', taggedItem);

  t.deepEqual(taggedItem.tags, ['freshy', 'lovely', 'shiny']);
  t.deepEqual(lessTaggedItem.tags, ['freshy', 'shiny']);
});
