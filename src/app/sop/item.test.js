import {
  makeItemId
} from './item_utils';


test('Item with single word', () => {
  const id = makeItemId('Single', 'abcd');

  expect(id).toBe('i_single-abcd');
});

test('Item with two and three words', () => {
  const id2 = makeItemId('dOuble do', '02');
  const id3 = makeItemId('TiplE Tri iRR', '0202');

  expect(id2).toBe('i_double-do-02');
  expect(id3).toBe('i_tiple-tri-irr-0202');
});

test('Name with spaces in front or back will be trim', () => {
  const id = makeItemId('  space space ', 'ad12');

  expect(id).toBe('i_space-space-ad12');
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