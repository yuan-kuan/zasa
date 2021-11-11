import * as R from 'ramda';

import { createTestHelper } from 'test/utils';
import * as free from 'fp/free';

import * as batch_ops from './batch_ops';
import * as item_ops from './item_ops';
import * as filter_ops from './filter_ops';
import { deleteAllDocs } from 'app/database';

const today = () => new Date();
const addDays = R.curry((date, days) =>
  R.compose(
    (date) => {
      date.setHours(0, 0, 0, 0);
      return date;
    },
    (date) => {
      let newDate = new Date();
      newDate.setDate(date.getDate() + days);
      return newDate;
    }
  )(today()));
const daysLater = addDays(today());

const hundredDaysLater = daysLater(100);
const fortyDaysLater = daysLater(40);
const twentyDaysLater = daysLater(20);
const sevenDaysLater = daysLater(7);

let itemIdApple, itemIdFerrari, itemIdSky, itemIdGrass;

const testHelper = createTestHelper(true, true);
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

test('No item when all remind dates are far away from today', async () => {
  const result = await interpret(
    free
      .sequence([
        batch_ops.create(itemIdApple, fortyDaysLater),
        batch_ops.create(itemIdApple, hundredDaysLater),
        batch_ops.create(itemIdSky, hundredDaysLater),
        batch_ops.create(itemIdGrass, fortyDaysLater),
        filter_ops.getRemindingItems()
      ])
      .map(R.last)
  )

  expect(result).toHaveLength(0);
});

test('Zero number of items when all remind dates are far away.', async () => {
  const result = await interpret(
    free
      .sequence([
        batch_ops.create(itemIdApple, fortyDaysLater),
        batch_ops.create(itemIdApple, hundredDaysLater),
        batch_ops.create(itemIdSky, hundredDaysLater),
        batch_ops.create(itemIdGrass, fortyDaysLater),
        filter_ops.getRemindingItemCount()
      ])
      .map(R.last)
  )

  expect(result).toBe(0);
});

test.only('Expiring flag default to false', async () => {
  const result = await interpret(
    free.bimap(
      (flag) => `got no flag ${flag}`,
      (flag) => `got flag ${flag}`,
      filter_ops.hasExpiringFlag()
    )
  );

  expect(result).toBe('got no flag false');
});

test.only('Set expiring flag to true', async () => {
  const result = await interpret(
    free.sequence([
      filter_ops.setExpiringFlag(true),
      free.bimap(
        (flag) => `got no flag ${flag}`,
        (flag) => `got flag ${flag}`,
        filter_ops.hasExpiringFlag()
      )
    ])
      .map(R.last)
  );

  expect(result).toBe('got flag true');
});

describe('Start with few batches in reminding period', () => {
  beforeEach(async () => {
    await interpret(
      free.sequence([
        batch_ops.create(itemIdApple, fortyDaysLater),
        batch_ops.create(itemIdApple, twentyDaysLater),
        batch_ops.create(itemIdApple, sevenDaysLater),
        batch_ops.create(itemIdFerrari, fortyDaysLater),
        batch_ops.create(itemIdSky, hundredDaysLater),
        batch_ops.create(itemIdSky, twentyDaysLater),
        batch_ops.create(itemIdGrass, hundredDaysLater),
        batch_ops.create(itemIdGrass, fortyDaysLater),
      ])
    );
  });

  test('Items with remind dates before today, sorted by earliest reminded data', async () => {
    const result = await interpret(filter_ops.getRemindingItems());

    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty('name', 'apple');
    expect(result[1]).toHaveProperty('name', 'sky');
  });

  test('Correct number of items has remind date before today', async () => {
    const result = await interpret(filter_ops.getRemindingItemCount());

    expect(result).toBe(2);
  });

  test('Added batch with reminded data before today will add the item to result', async () => {
    const [countBeforeAdd, _, result] = await interpret(
      free.sequence([
        filter_ops.getRemindingItemCount(),
        batch_ops.create(itemIdGrass, sevenDaysLater),
        filter_ops.getRemindingItems()
      ])
    );

    expect(countBeforeAdd).toBe(2);
    expect(result).toHaveLength(3);
    expect(result[0]).toHaveProperty('name', 'apple');
    expect(result[1]).toHaveProperty('name', 'grass');
    expect(result[2]).toHaveProperty('name', 'sky');
  });

  test('Removed reminding batch will get new result', async () => {
    const [countBeforeAdd, _, result] = await interpret(
      free.sequence([
        filter_ops.getRemindingItemCount(),
        batch_ops
          .getAll(itemIdApple)
          .map(R.init) // The first two batches of apple is within reminding
          .chain(deleteAllDocs), // Remove them
        filter_ops.getRemindingItems()
      ])
    );

    expect(countBeforeAdd).toBe(2);
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('name', 'sky');
  });

  test('Shorten remind days on an item to hide it from filter', async () => {
    const [countBeforeAdd, _, result] = await interpret(
      free.sequence([
        filter_ops.getRemindingItemCount(),
        item_ops.editRemindDays(itemIdSky, 14),
        filter_ops.getRemindingItems()
      ])
    );

    expect(countBeforeAdd).toBe(2);
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('name', 'apple');
  });

  test('Lengthen remind days on an item to show it from filter', async () => {
    const [countBeforeAdd, _, result] = await interpret(
      free.sequence([
        filter_ops.getRemindingItemCount(),
        item_ops.editRemindDays(itemIdFerrari, 60),
        filter_ops.getRemindingItems()
      ])
    );

    expect(countBeforeAdd).toBe(2);
    expect(result).toHaveLength(3);
    expect(result[0]).toHaveProperty('name', 'apple');
    expect(result[1]).toHaveProperty('name', 'ferrari');
    expect(result[2]).toHaveProperty('name', 'sky');
  });
});