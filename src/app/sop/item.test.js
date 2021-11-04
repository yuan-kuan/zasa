import {
  addBatch,
  makeBatchDoc,
  updateRemindDay,
  makeItemDoc,
  addTag,
  removeTag,
} from './item_utils';


test('Item with single word', () => {
  const item = makeItemDoc('Single', 'abcd');

  expect(item._id).toBe('i_single-abcd');
  expect(item.name).toBe('Single');
});

test('Item with two and three words', () => {
  const item2 = makeItemDoc('dOuble do', '02');
  const item3 = makeItemDoc('TiplE Tri iRR', '0202');

  expect(item2._id).toBe('i_double-do-02');
  expect(item2.name).toBe('dOuble do');

  expect(item3._id).toBe('i_tiple-tri-irr-0202');
  expect(item3.name).toBe('TiplE Tri iRR');
});

test('Name with spaces in front or back will be trim', () => {
  const item = makeItemDoc('  space space ', 'ad12');

  expect(item._id).toBe('i_space-space-ad12');
  expect(item.name).toBe('space space');
});

test('Batch create with item id and YMD, start with 0 count', () => {
  const expiry = new Date('2020-04-27T01:00:00');
  const remindDays = 30;
  const remindDate = new Date('2020-05-27T01:00:00');
  const batch = makeBatchDoc('i_abc_cba', expiry, remindDays);

  expect(batch.type).toBe('b');
  expect(batch._id).toBe('b_abc_cba:20200427');
  expect(batch.expiry).toBe(expiry.valueOf());
  expect(batch.remind).toBe(remindDate.valueOf());
  expect(batch.count).toBe(0);
});

test('Increment Batch', () => {
  const d = new Date('2020-01-01T01:00:00');
  const batch = makeBatchDoc('i_abc_cba', d, 30);
  let incBatch = addBatch(2, batch);

  expect(incBatch._id).toBe('b_abc_cba:20200101');
  expect(incBatch.count).toBe(2);
});

test('Decrement Batch', () => {
  const batch = makeBatchDoc('i_abc_cba', new Date('2020-01-01T01:00:00'), 30);
  let incBatch = addBatch(2, batch);
  let decBatch = addBatch(-1, incBatch);

  expect(decBatch._id).toBe('b_abc_cba:20200101');
  expect(decBatch.count).toBe(1);
});

test('Update Batch remind date', () => {
  const expiry = new Date('2020-01-01T01:00:00');
  const batch = makeBatchDoc('i_abc_cba', expiry, 30);
  let updatedBatch = updateRemindDay(14, batch);

  const newRemind = new Date('2020-01-15T01:00:00');

  expect(updatedBatch.expiry).toBe(expiry.valueOf());
  expect(updatedBatch.remind).toBe(newRemind.valueOf());
});

test('Add a new tag to item', () => {
  const item = makeItemDoc('with new tag', 'bo');
  const taggedItem = addTag('shiny', item);

  expect(taggedItem.tags).toStrictEqual(['shiny']);
});

test('tags and ordered ascending', () => {
  const item = makeItemDoc('with new tag', 'bo');
  const taggedItem = addTag('shiny', item);
  const taggedTwiceItem = addTag('freshy', taggedItem);
  const taggedThriceItem = addTag('lovely', taggedTwiceItem);

  expect(taggedItem.tags).toStrictEqual(['shiny']);
  expect(taggedTwiceItem.tags).toStrictEqual(['freshy', 'shiny']);
  expect(taggedThriceItem.tags).toStrictEqual(['freshy', 'lovely', 'shiny']);
});

test('remove tag kept order', () => {
  const item = makeItemDoc('with new tag', 'bo');
  const taggedItem = addTag('shiny', addTag('freshy', addTag('lovely', item)));
  const lessTaggedItem = removeTag('lovely', taggedItem);

  expect(taggedItem.tags).toStrictEqual(['freshy', 'lovely', 'shiny']);
  expect(lessTaggedItem.tags).toStrictEqual(['freshy', 'shiny']);
});
