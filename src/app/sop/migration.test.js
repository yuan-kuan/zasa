import * as R from 'ramda';

import { createTestHelper } from 'test/utils';
import * as free from 'fp/free';

import * as batch_ops from './batch_ops';
import * as item_ops from './item_ops';
import * as filter_ops from './filter_ops';
import * as stock_ops from './stock_ops';
import * as version_ops from './version_ops';

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

test('Change item with batch to has stock, item with no batch to out of stock', async () => {
  const expiryDate = new Date();
  const result = await interpret(
    free
      .sequence([
        batch_ops.create(itemIdApple, expiryDate),
        batch_ops.create(itemIdFerrari, expiryDate),
        version_ops.migrate(1),
        filter_ops.getOutOfStockItems(),
      ])
      .map(R.last)
  )

  expect(result).toHaveLength(2);
  expect(result[0]).toHaveProperty('name', 'grass');
  expect(result[1]).toHaveProperty('name', 'sky');

  const hasStockResult = await interpret(
    free.sequence([
      stock_ops.getItemStockStatus(itemIdApple),
      stock_ops.getItemStockStatus(itemIdFerrari),
    ])
  );

  expect(hasStockResult).toStrictEqual([stock_ops.Status.has_stock, stock_ops.Status.has_stock]);
});

test('Migrating data with stock status should not cause issue', async () => {
  const expiryDate = new Date();
  const result = await interpret(
    free
      .sequence([
        batch_ops.create(itemIdApple, expiryDate),
        batch_ops.create(itemIdFerrari, expiryDate),
        version_ops.migrate(1),
        filter_ops.getOutOfStockItems(),
        version_ops.migrate(1),
        filter_ops.getOutOfStockItems(),
      ])
      .map(R.last)
  )

  expect(result).toHaveLength(2);
  expect(result[0]).toHaveProperty('name', 'grass');
  expect(result[1]).toHaveProperty('name', 'sky');

  const hasStockResult = await interpret(
    free.sequence([
      stock_ops.getItemStockStatus(itemIdApple),
      stock_ops.getItemStockStatus(itemIdFerrari),
    ])
  );

  expect(hasStockResult).toStrictEqual([stock_ops.Status.has_stock, stock_ops.Status.has_stock]);
});