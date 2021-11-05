import PouchDB from 'pouchdb';

import { promise, resolve } from 'fluture';
import { dispatch } from 'fp/interpretor';
import * as database from 'app/database';
import * as utils from 'app/utils';
import { create, getItemWithPhoto } from './item_ops';

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