import * as R from 'ramda';
import * as free from 'fp/free';

import { createTestInterpetor } from "test/utils";
import { create, editName, editPhoto, editRemindDays, getItemRemindDays, getItemWithPhoto } from './item_ops';

const interpret = createTestInterpetor(true);

test('Create item with name only', async () => {
  const fm = create('testName', null)
    .chain(getItemWithPhoto);

  const result = await interpret(fm)
  expect(result).toHaveProperty('name', 'testName');
  expect(result.blob).toBeFalsy();
});

test('Create item with name and photo', async () => {
  const fm = create('testName', Buffer.from('Hello Blob'))
    .chain(getItemWithPhoto);

  const result = await interpret(fm)
  expect(result).toHaveProperty('name', 'testName');
  expect(result).toHaveProperty('blob', Buffer.from('Hello Blob'));
});

test('New item starts with 30 remind days.', async () => {
  const fm = create('test remind day', null)
    .chain(getItemRemindDays);

  const result = await interpret(fm)
  expect(result).toBe(30);
});

test('Edit item remind days', async () => {
  const fm = create('test remind day', null)
    .chain((itemId) =>
      free.sequence([
        editRemindDays(itemId, 10),
        getItemRemindDays(itemId)
      ])
    )
    .map(R.last);

  const result = await interpret(fm)
  expect(result).toBe(10);
});

test('Edit item name', async () => {
  const fm = create('testEditName', null)
    .chain((itemId) =>
      editName(itemId, 'new name')
        .chain((_) => getItemWithPhoto(itemId)));

  const result = await interpret(fm);
  expect(result.name).toBe('new name');
});

test('Edit item photo', async () => {
  const fm = create('testEditName', Buffer.from('First Blob'))
    .chain((itemId) =>
      editPhoto(itemId, Buffer.from('Second Blob'))
        .chain((_) => getItemWithPhoto(itemId)));

  const result = await interpret(fm);
  expect(result.blob).toEqual(Buffer.from('Second Blob'));
});