import * as R from 'ramda';

import { createTestHelper } from 'test/utils';
import * as free from 'fp/free';

import * as batch_ops from './batch_ops';
import * as item_ops from './item_ops';
import * as filter_ops from './filter_ops';
import * as stock_ops from './stock_ops';
import * as tag_ops from "./tag_ops";

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

let runningDate = 1;
beforeEach(() => {
  runningDate = 1;
});

describe('Batch to say stock', () => {
  const testHelper = createTestHelper(true);
  let interpret;
  beforeEach(() => {
    interpret = testHelper.setup();
  });

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
});

describe('Filter for out of stock', () => {
  let itemIdApple, itemIdFerrari, itemIdSky, itemIdGrass;

  const testHelper = createTestHelper(true);
  let interpret;

  beforeEach(async () => {
    interpret = testHelper.setup();
    const results = await interpret(
      free.sequence([
        filter_ops.setup(),
        item_ops.create('apple', null),
        item_ops.create('ferrari', null),
        item_ops.create('sky', null),
        item_ops.create('grass', null),
      ])
    );

    itemIdApple = results[1];
    itemIdFerrari = results[2];
    itemIdSky = results[3];
    itemIdGrass = results[4];
  });

  test('Return items with no stocks', async () => {
    const preparation = free.sequence([
      createBatch(itemIdApple),
      createBatch(itemIdFerrari),
      createBatch(itemIdSky),
      createBatch(itemIdGrass),

      removeBatch(itemIdApple),
      removeBatch(itemIdFerrari),
    ]);

    const itemResults = await interpret(
      preparation.chain(() => filter_ops.getOutOfStockItems()));

    expect(itemResults).toHaveLength(2);
    expect(itemResults[0]).toHaveProperty('name', 'apple');
    expect(itemResults[1]).toHaveProperty('name', 'ferrari');

    const countResult = await interpret(filter_ops.getOutOfStockItemsCount());
    expect(countResult).toBe(2);
  });

  test('Brand new item is not out of stock', async () => {
    const preparation = free.sequence([
      createBatch(itemIdApple),
      createBatch(itemIdFerrari),
      removeBatch(itemIdApple),
      removeBatch(itemIdFerrari),
    ]);

    const itemResults = await interpret(
      preparation.chain(() => filter_ops.getOutOfStockItems()));

    expect(itemResults).toHaveLength(2);
    expect(itemResults[0]).toHaveProperty('name', 'apple');
    expect(itemResults[1]).toHaveProperty('name', 'ferrari');

    const countResult = await interpret(
      preparation.chain(() => filter_ops.getOutOfStockItemsCount()));
    expect(countResult).toBe(2);
  });

  test('Restock remove items from filter', async () => {
    const preparation = free.sequence([
      createBatch(itemIdApple),
      createBatch(itemIdFerrari),
      removeBatch(itemIdApple),
      removeBatch(itemIdFerrari),
      createBatch(itemIdFerrari),
    ]);

    const itemResults = await interpret(
      preparation.chain(() => filter_ops.getOutOfStockItems()));

    expect(itemResults).toHaveLength(1);
    expect(itemResults[0]).toHaveProperty('name', 'apple');

    const countResult = await interpret(filter_ops.getOutOfStockItemsCount());
    expect(countResult).toBe(1);
  });

  describe('with tags', () => {
    beforeEach(async () => {
      await interpret(
        free.sequence([
          tag_ops.add(itemIdApple, 'fruit'),
          tag_ops.add(itemIdApple, 'red'),
          tag_ops.add(itemIdFerrari, 'red'),
          tag_ops.add(itemIdFerrari, 'car'),
          tag_ops.add(itemIdSky, 'blue'),
          tag_ops.add(itemIdSky, 'natural'),
          tag_ops.add(itemIdGrass, 'natural'),
          tag_ops.add(itemIdGrass, 'green'),
        ]))
    });

    test('Return item with the tag with no stock', async () => {
      const preparation = free.sequence([
        createBatch(itemIdApple),
        createBatch(itemIdFerrari),
        createBatch(itemIdSky),
        createBatch(itemIdGrass),

        removeBatch(itemIdApple),
        removeBatch(itemIdFerrari),
      ]);

      const itemResults = await interpret(
        preparation.chain(() => filter_ops.getOutOfStockItemsWithTags(['car'])));

      expect(itemResults).toHaveLength(1);
      expect(itemResults[0]).toHaveProperty('name', 'ferrari');
    });

    test('Return item with the tag with no stock - 2', async () => {
      const preparation = free.sequence([
        createBatch(itemIdApple),
        createBatch(itemIdFerrari),
        createBatch(itemIdSky),
        createBatch(itemIdGrass),

        removeBatch(itemIdApple),
        removeBatch(itemIdFerrari),
        removeBatch(itemIdSky),
        removeBatch(itemIdGrass),
      ]);

      const itemResults = await interpret(
        preparation.chain(() => filter_ops.getOutOfStockItemsWithTags(['natural'])));

      expect(itemResults).toHaveLength(2);
      expect(itemResults[0]).toHaveProperty('name', 'grass');
      expect(itemResults[1]).toHaveProperty('name', 'sky');
    });
  });
});