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

// TODO: test the id generation, not the whole doc
// test('Batch create with item id and YMD, start with 0 count', () => {
//   const expiry = new Date('2020-04-27T01:00:00');
//   const remindDays = 30;
//   const remindDate = new Date('2020-05-27T01:00:00');
//   const batch = makeBatchDoc('i_abc_cba', expiry, remindDays);

//   expect(batch.type).toBe('b');
//   expect(batch._id).toBe('b_abc_cba:20200427');
//   expect(batch.expiry).toBe(expiry.valueOf());
//   expect(batch.remind).toBe(remindDate.valueOf());
//   expect(batch.count).toBe(0);
// });