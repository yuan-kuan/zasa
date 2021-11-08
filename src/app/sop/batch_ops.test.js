import * as R from 'ramda';

import { createTestHelper } from 'test/utils';
import * as free from 'fp/free';

import * as batch_ops from './batch_ops';
import * as item_ops from './item_ops';

const testHelper = createTestHelper(true);
let interpret;
beforeEach(() => {
  interpret = testHelper.setup();
});

test('Create a batch with correct date and count of 1', async () => {
  const expiry = new Date('2020-04-27T01:00:00');
  const fm = item_ops.create('test batch', null)
    .chain((itemId) =>
      free.sequence([
        batch_ops.create(itemId, expiry),
        batch_ops.getAll(itemId)
      ]))
    // Free.Sequence result in an array, we are interested in the last one.
    .map(R.last);

  const result = await interpret(fm);
  expect(result).toHaveLength(1);
  expect(result[0]).toHaveProperty('expiry', expiry.valueOf());
  expect(result[0]).toHaveProperty('count', 1);
});

test('Create batch with remind date calculated from item, new item has 30 days', async () => {
  const expiry = new Date('2020-04-27T01:00:00');
  const fm = item_ops.create('test batch 30 remind', null)
    .chain((itemId) =>
      free.sequence([batch_ops.create(itemId, expiry),
      batch_ops.getAll(itemId)])
    )
    .map(R.last);


  const result = await interpret(fm);
  expect(result[0]).toHaveProperty('remind', (new Date('2020-05-27T01:00:00')).valueOf());
});

test('Create batch with a 14 remind days item', async () => {
  const expiry = new Date('2020-04-01T01:00:00');
  const fm = item_ops.create('test batch 14 remind', null)
    .chain((itemId) => free.sequence([
      item_ops.editRemindDays(itemId, 14),
      batch_ops.create(itemId, expiry),
      batch_ops.getAll(itemId),
    ]))
    .map(R.last);


  const result = await interpret(fm);
  expect(result[0]).toHaveProperty('remind', (new Date('2020-04-15T01:00:00')).valueOf());
});

test('Create 3 batches, order them by expiry', async () => {
  const expiry1 = new Date('2020-04-27T01:00:00');
  const expiry2 = new Date('2020-05-27T01:00:00');
  const expiry3 = new Date('2020-05-28T01:00:00');

  const fm = item_ops.create('test batches', null)
    .chain((itemId) =>
      free.sequence([
        // shuffle the order on purpose
        batch_ops.create(itemId, expiry2),
        batch_ops.create(itemId, expiry3),
        batch_ops.create(itemId, expiry1),
        batch_ops.getAll(itemId)
      ]))
    .map(R.last);

  const result = await interpret(fm);
  expect(result).toHaveLength(3);
  expect(result[0]).toHaveProperty('expiry', expiry1.valueOf());
  expect(result[0]).toHaveProperty('remind', (new Date('2020-05-27T01:00:00')).valueOf());
  expect(result[1]).toHaveProperty('expiry', expiry2.valueOf());
  expect(result[1]).toHaveProperty('remind', (new Date('2020-06-26T01:00:00')).valueOf());
  expect(result[2]).toHaveProperty('expiry', expiry3.valueOf());
  expect(result[2]).toHaveProperty('remind', (new Date('2020-06-27T01:00:00')).valueOf());
});

test('Changing item remind days should update all batches remind', async () => {
  const expiry1 = new Date('2020-04-27T01:00:00');
  const expiry2 = new Date('2020-05-27T01:00:00');
  const expiry3 = new Date('2020-05-28T01:00:00');

  const fm = item_ops.create('test update remind days change batch', null)
    .chain((itemId) =>
      free.sequence([
        // shuffle the order on purpose
        batch_ops.create(itemId, expiry2),
        batch_ops.create(itemId, expiry3),
        batch_ops.create(itemId, expiry1),
        item_ops.editRemindDays(itemId, 10),
        batch_ops.getAll(itemId)
      ]))
    .map(R.last);

  const result = await interpret(fm);
  expect(result).toHaveLength(3);
  // Expect expiry dates are unchanged
  expect(result[0]).toHaveProperty('expiry', expiry1.valueOf());
  expect(result[1]).toHaveProperty('expiry', expiry2.valueOf());
  expect(result[2]).toHaveProperty('expiry', expiry3.valueOf());
  // Expect remind dates are all 10 days before expiry (instead of the original 30 days)
  expect(result[0]).toHaveProperty('remind', (new Date('2020-05-07T01:00:00')).valueOf());
  expect(result[1]).toHaveProperty('remind', (new Date('2020-06-06T01:00:00')).valueOf());
  expect(result[2]).toHaveProperty('remind', (new Date('2020-06-07T01:00:00')).valueOf());
});

test('Increment the count of a batch', async () => {
  const expiry = new Date('2020-04-27T01:00:00');
  const fm = item_ops.create('test batch inc', null)
    .chain((itemId) =>
      free.sequence([
        batch_ops.create(itemId, expiry),
        batch_ops.getAll(itemId).chain(
          R.pipe(
            R.head(),
            batch_ops.incAndSaveCount,
            R.chain(batch_ops.incAndSaveCount)
          ))
      ]))
    .map(R.last);


  const result = await interpret(fm);
  expect(result).toHaveProperty('count', 3);
});


test('Decrement the count of a batch', async () => {
  const expiry = new Date('2020-04-27T01:00:00');
  const fm = item_ops.create('test batch dec', null)
    .chain((itemId) =>
      free.sequence([
        batch_ops.create(itemId, expiry),
        batch_ops.getAll(itemId).chain(
          R.pipe(
            R.head(),
            batch_ops.incAndSaveCount,
            R.chain(batch_ops.incAndSaveCount),
            R.chain(batch_ops.decAndSaveCount),
          ))
      ]))
    .map(R.last);


  const result = await interpret(fm);
  expect(result).toHaveProperty('count', 2);
});

test('Remove a batch', async () => {
  const expiry1 = new Date('2020-04-27T01:00:00');
  const expiry2 = new Date('2020-04-28T01:00:00');
  const fm = item_ops.create('test batch remove', null)
    .chain((itemId) =>
      free.sequence([
        batch_ops.create(itemId, expiry1),
        batch_ops.create(itemId, expiry2),
        batch_ops.getAll(itemId).chain(
          R.pipe(
            R.head(),
            R.prop('_id'),
            batch_ops.remove
          )),
        batch_ops.getAll(itemId)
      ]))
    .map(R.last);


  const result = await interpret(fm);
  expect(result).toHaveLength(1);
  expect(result[0]).toHaveProperty('expiry', expiry2.valueOf());
  expect(result[0]).toHaveProperty('count', 1);
});

test('Remove an item should remove all batch too', async () => {
  const expiry1 = new Date('2020-04-27T01:00:00');
  const expiry2 = new Date('2020-04-28T01:00:00');
  const fm = item_ops.create('test delete item no more batch', null)
    .chain((itemId) =>
      free.sequence([
        batch_ops.create(itemId, expiry1),
        batch_ops.create(itemId, expiry2),
        item_ops.remove(itemId),
        batch_ops.getAll(itemId)
      ]))
    .map(R.last);


  const result = await interpret(fm);
  expect(result).toHaveLength(0);
});