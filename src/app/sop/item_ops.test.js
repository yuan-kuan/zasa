import PouchDB from 'pouchdb';

import { promise, resolve } from 'fluture';
import { dispatch } from 'fp/interpretor';
import * as database from 'app/database';
import * as utils from 'app/utils';
import { create, editName, editPhoto, getItemWithPhoto } from './item_ops';

PouchDB.plugin(require('pouchdb-adapter-memory'));
const MemPouch = PouchDB.defaults({
  adapter: 'memory',
});

const dbDispatcher = database.setupDatabaseInterpretor(MemPouch('item-test'));

const interpret = (freeMonad) => freeMonad.foldMap(dispatch([
  dbDispatcher, utils.utilsInterpretor
]), resolve);

test('Create item with name only', async () => {
  const fm = create('testName', null)
    .chain(getItemWithPhoto);

  const future = interpret(fm);

  const result = await promise(future)
  expect(result).toHaveProperty('name', 'testName');
  expect(result.blob).toBeFalsy();
});

test('Create item with name and photo', async () => {
  const fm = create('testName', Buffer.from('Hello Blob'))
    .chain(getItemWithPhoto);

  const future = interpret(fm);

  const result = await promise(future)
  expect(result).toHaveProperty('name', 'testName');
  expect(result).toHaveProperty('blob', Buffer.from('Hello Blob'));
});

test('Edit item name', async () => {
  const fm = create('testEditName', null)
    .chain((itemId) =>
      editName(itemId, 'new name')
        .chain((_) => getItemWithPhoto(itemId)));

  const result = await promise(interpret(fm));
  expect(result.name).toBe('new name');
});

test('Edit item photo', async () => {
  const fm = create('testEditName', Buffer.from('First Blob'))
    .chain((itemId) =>
      editPhoto(itemId, Buffer.from('Second Blob'))
        .chain((_) => getItemWithPhoto(itemId)));

  const result = await promise(interpret(fm));
  expect(result.blob).toEqual(Buffer.from('Second Blob'));
});