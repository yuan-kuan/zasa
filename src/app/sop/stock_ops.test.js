import * as R from 'ramda';

import { createTestHelper } from 'test/utils';
import * as free from 'fp/free';

import * as batch_ops from './batch_ops';
import * as item_ops from './item_ops';
import * as stock_ops from './stock_ops';

const testHelper = createTestHelper(true);
let interpret;
let runningDate = 1;

beforeEach(() => {
  interpret = testHelper.setup();
  runningDate = 1;
});

const randomDate = () => {
  let d = new Date('2020-04-27T01:00:00');
  d.setDate(runningDate++);
  return d;
}

const createBatch = (itemId) =>
  free.sequence([
    batch_ops.create(itemId, randomDate()),
    stock_ops.refreshItemStockStatus(itemId),
  ]);

const increaseBatchCount = (itemId) =>
  free.sequence([
    batch_ops.getAll(itemId).chain(
      R.pipe(
        R.head,
        batch_ops.incAndSaveCount,
      )
    ),
    stock_ops.refreshItemStockStatus(itemId),
  ]);

const decreaseBatchCount = (itemId) =>
  free.sequence([
    batch_ops.getAll(itemId).chain(
      R.pipe(
        R.head,
        batch_ops.decAndSaveCount,
      )
    ),
    stock_ops.refreshItemStockStatus(itemId),
  ]);

const removeBatch = (itemId) =>
  free.sequence([
    batch_ops.getAll(itemId).chain(
      R.pipe(
        R.head,
        R.prop('_id'),
        batch_ops.remove
      )
    ),
    stock_ops.refreshItemStockStatus(itemId),
  ]);

test('New item do not have stock status', async () => {
  const fm = item_ops.create('brand_new', null).chain(stock_ops.getItemStockStatus);
  const result = await interpret(fm);
  expect(result).toBe(stock_ops.Status.brand_new);
});

test('New item still has brand new status after refresh', async () => {
  const fm = item_ops.create('brand_new_refresh', null)
    .chain((itemId) => free.sequence([
      stock_ops.refreshItemStockStatus(itemId),
      stock_ops.getItemStockStatus(itemId)
    ]))
    .map(R.last);

  const result = await interpret(fm);
  expect(result).toBe(stock_ops.Status.brand_new);
});

test('Adding new batch to item change to have stock status', async () => {
  const fm = item_ops.create('add_a_batch', null)
    .chain((itemId) =>
      free.sequence([
        createBatch(itemId),
        stock_ops.getItemStockStatus(itemId),
      ]))
    .map(R.last);

  const result = await interpret(fm);
  expect(result).toBe(stock_ops.Status.has_stock);
});

test('Adding more batch to have stock item does not change its status', async () => {
  const fm = item_ops.create('add_a_batch', null)
    .chain((itemId) =>
      free.sequence([
        createBatch(itemId),
        stock_ops.getItemStockStatus(itemId),
        createBatch(itemId),
        stock_ops.getItemStockStatus(itemId),
      ]))
    .map(R.last);

  const result = await interpret(fm);
  expect(result).toBe(stock_ops.Status.has_stock);
});

test('Adding new count to a batch does not change item stock status', async () => {
  const fm = item_ops.create('add_count', null)
    .chain((itemId) =>
      free.sequence([
        createBatch(itemId),
        increaseBatchCount(itemId),
        stock_ops.getItemStockStatus(itemId),
      ]))
    .map(R.last);

  const result = await interpret(fm);
  expect(result).toBe(stock_ops.Status.has_stock);
});

test('Remove all batch from item change to no stock status', async () => {
  const fm = item_ops.create('remove_all_batch', null)
    .chain((itemId) =>
      free.sequence([
        createBatch(itemId),
        removeBatch(itemId),
        stock_ops.getItemStockStatus(itemId),
      ]))
    .map(R.last);

  const result = await interpret(fm);
  expect(result).toBe(stock_ops.Status.out_of_stock);
});

test('Remove partial batch does not change stock status', async () => {
  const fm = item_ops.create('test batch remove', null)
    .chain((itemId) =>
      free.sequence([
        createBatch(itemId),
        createBatch(itemId),
        removeBatch(itemId),
        stock_ops.getItemStockStatus(itemId),
      ]))
    .map(R.last);

  const result = await interpret(fm);
  expect(result).toBe(stock_ops.Status.has_stock);
});

test('Reduce count on a batch does not change item stock status', async () => {
  const fm = item_ops.create('reduce_count', null)
    .chain((itemId) =>
      free.sequence([
        createBatch(itemId),
        decreaseBatchCount(itemId),
        stock_ops.getItemStockStatus(itemId),
      ]))
    .map(R.last);

  const result = await interpret(fm);
  expect(result).toBe(stock_ops.Status.has_stock);
});

// describe('Filter for out of stock', () => {
//   test('', async () => {
//     throw Error('empty test');
//   });
// });