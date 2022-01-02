import * as R from 'ramda';
import * as free from 'fp/free';

import { createTestHelper } from "test/utils";
import * as item_ops from './item_ops';
import { tapLog } from 'app/utils';

const testHelper = createTestHelper(true);
let interpret;
beforeEach(() => {
  interpret = testHelper.setup();
});

test('Create item with name only', async () => {
  const fm = item_ops.create('testName', null)
    .chain(item_ops.getItemWithPhoto);

  const result = await interpret(fm)
  expect(result).toHaveProperty('name', 'testName');
  expect(result.blob).toBeFalsy();
});

test('Create item with name and photo', async () => {
  const fm = item_ops.create('testName', Buffer.from('Hello Blob'))
    .chain(item_ops.getItemWithPhoto);

  const result = await interpret(fm)
  expect(result).toHaveProperty('name', 'testName');
  expect(result).toHaveProperty('blob', Buffer.from('Hello Blob'));
});

test('New item starts with 30 remind days.', async () => {
  const fm = item_ops.create('test remind day', null)
    .chain(item_ops.getItemRemindDays);

  const result = await interpret(fm)
  expect(result).toBe(30);
});

test('Edit item remind days', async () => {
  const fm = item_ops.create('test remind day', null)
    .chain((itemId) =>
      free.sequence([
        item_ops.editRemindDays(itemId, 10),
        item_ops.getItemRemindDays(itemId)
      ])
    )
    .map(R.last);

  const result = await interpret(fm)
  expect(result).toBe(10);
});

test('Edit item name', async () => {
  const fm = item_ops.create('testEditName', null)
    .chain((itemId) =>
      item_ops.editName(itemId, 'new name')
        .chain((_) => item_ops.getItemWithPhoto(itemId)));

  const result = await interpret(fm);
  expect(result.name).toBe('new name');
});

test('Edit item photo', async () => {
  const fm = item_ops.create('testEditName', Buffer.from('First Blob'))
    .chain((itemId) =>
      item_ops.editPhoto(itemId, Buffer.from('Second Blob'))
        .chain((_) => item_ops.getItemWithPhoto(itemId)));

  const result = await interpret(fm);
  expect(result.blob).toEqual(Buffer.from('Second Blob'));
});

test('Edit item note', async () => {
  const fm = item_ops.create('testEditNote', null)
    .chain((itemId) =>
      item_ops.editNote(itemId, 'Some Notes')
        .chain((_) => item_ops.getItemNote(itemId)));

  const result = await interpret(fm);
  expect(result).toEqual('Some Notes');
});

test('Get all created items', async () => {
  const fm =
    free
      .sequence([
        item_ops.create('test item 3', Buffer.from('C')),
        item_ops.create('test item 1', Buffer.from('A')),
        item_ops.create('test item 2', Buffer.from('B')),
        item_ops.getAll()
      ])
      .map(R.last);

  const result = await interpret(fm);
  expect(result).toHaveLength(3);
  expect(result[0].name).toBe('test item 1');
  expect(result[1].name).toBe('test item 2');
  expect(result[2].name).toBe('test item 3');
});

test('Deleted items will not be in get all', async () => {
  const fm =
    free
      .sequence([
        item_ops.create('test item 3', Buffer.from('C')),
        item_ops.create('test item 1', Buffer.from('A')),
        item_ops.create('test item 2', Buffer.from('B')),
      ])
      .map(R.last) // Take the result of the last, which is a item id
      .chain(item_ops.remove) // Remove the item with the id
      .chain((_) => item_ops.getAll()) // get All to check

  const result = await interpret(fm);
  expect(result).toHaveLength(2);
  expect(result[0].name).toBe('test item 1');
  expect(result[1].name).toBe('test item 3');
});