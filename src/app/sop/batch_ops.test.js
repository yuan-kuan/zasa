import { promise, resolve } from 'fluture';
import PouchDB from 'pouchdb';
import * as R from 'ramda';

import { dispatch } from 'fp/interpretor';
import * as free from 'fp/free';

import * as database from 'app/database';
import * as utils from 'app/utils';
import { getAll, create } from './batch_ops';
import * as item_ops from './item_ops';

PouchDB.plugin(require('pouchdb-adapter-memory'));
const MemPouch = PouchDB.defaults({
  adapter: 'memory',
});

const dbDispatcher = database.setupDatabaseInterpretor(MemPouch('item-test'));

const interpret = (freeMonad) => freeMonad.foldMap(dispatch([
  dbDispatcher, utils.utilsInterpretor
]), resolve);

test('Create a batch with correct date and count of 1', async () => {
  const expiry = new Date('2020-04-27T01:00:00');
  const fm = item_ops.create('test batch', null)
    .chain((itemId) =>
      free.sequence([
        create(itemId, expiry),
        getAll(itemId)
      ]))
    .map(R.last);

  const result = await promise(interpret(fm));
  expect(result).toHaveLength(1);
  expect(result[0]).toHaveProperty('expiry', expiry.valueOf());
  expect(result[0]).toHaveProperty('count', 1);
});

test('Create batch with remind date calculated from item, new item has 30 days', async () => {
  const expiry = new Date('2020-04-27T01:00:00');
  const fm = item_ops.create('test batch 30 remind', null)
    .chain((itemId) =>
      free.sequence([create(itemId, expiry),
      getAll(itemId)])
    )
    .map(R.last);


  const result = await promise(interpret(fm));
  expect(result[0]).toHaveProperty('remind', (new Date('2020-05-27T01:00:00')).valueOf());
});

test('Create batch with a 14 remind days item', async () => {
  const expiry = new Date('2020-04-01T01:00:00');
  const fm = item_ops.create('test batch 14 remind', null)
    .chain((itemId) => free.sequence([
      item_ops.editRemindDays(itemId, 14),
      create(itemId, expiry),
      getAll(itemId),
    ]))
    .map(R.last);


  const result = await promise(interpret(fm));
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
        create(itemId, expiry2),
        create(itemId, expiry3),
        create(itemId, expiry1),
        getAll(itemId)
      ]))
    .map(R.last);

  const result = await promise(interpret(fm));
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
        create(itemId, expiry2),
        create(itemId, expiry3),
        create(itemId, expiry1),
        item_ops.editRemindDays(itemId, 10),
        getAll(itemId)
      ]))
    .map(R.last);

  const result = await promise(interpret(fm));
  expect(result).toHaveLength(3);
  expect(result[0]).toHaveProperty('expiry', expiry1.valueOf());
  expect(result[0]).toHaveProperty('remind', (new Date('2020-05-07T01:00:00')).valueOf());
  expect(result[1]).toHaveProperty('expiry', expiry2.valueOf());
  expect(result[1]).toHaveProperty('remind', (new Date('2020-06-06T01:00:00')).valueOf());
  expect(result[2]).toHaveProperty('expiry', expiry3.valueOf());
  expect(result[2]).toHaveProperty('remind', (new Date('2020-06-07T01:00:00')).valueOf());
});