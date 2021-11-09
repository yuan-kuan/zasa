import * as R from 'ramda';
import * as free from 'fp/free';

import * as db_ops from 'app/db_ops';
import { allDocs, bulkDocs, del, deleteAllDocs, put } from 'app/database';
import { tapLog } from 'app/utils';

import * as item_ops from "./item_ops";
import { makeBatchId, convertItemIdToBatchId } from './item_utils';

const L = {
  id: R.lensProp('_id'),
  itemId: R.lensProp('itemId'),
  type: R.lensProp('type'),
  remindDays: R.lensProp('remindDays'),
  expiry: R.lensProp('expiry'),
  remind: R.lensProp('remind'),
  count: R.lensProp('count'),
};

const msBeforeDays = (date, days) => date.valueOf() - days * 24 * 60 * 60 * 1000

const makeGetBatchesAllDocOption = (itemId) =>
  R.pipe(convertItemIdToBatchId, db_ops.makeStartEndRangeAllDocOption)(itemId);

const getAll = (itemId) => free
  .of(itemId) //
  .map(makeGetBatchesAllDocOption)
  .chain(allDocs);

const makeBatchDoc = R.curry((itemId, expiry, days) =>
  R.pipe(
    R.set(L.id, makeBatchId(itemId, expiry)),
    R.set(L.expiry, expiry.valueOf()),
    R.set(L.remind, msBeforeDays(expiry, days)),
    R.set(L.type, 'b'),
    R.set(L.count, 1)
  )({})
);
const create = (itemId, expiry) =>
  free
    .of(itemId)
    .chain(item_ops.getItemRemindDays)
    .map(makeBatchDoc(itemId, expiry))
    .chain(put)

const remove = del;

const removeAll = (itemId) =>
  free.of(itemId)
    .chain(getAll)
    .chain(deleteAllDocs);

const updateBatchRemind = R.curry((days, batchDoc) =>
  R.set(L.remind, msBeforeDays(batchDoc.expiry, days), batchDoc));

const updateAllRemind = (itemId) =>
  free
    .of(R.curry((days, batches) =>
      R.map(updateBatchRemind(days), batches)
    ))
    .ap(item_ops.getItemRemindDays(itemId))
    .ap(getAll(itemId))
    .chain(bulkDocs)

const addCount = R.curry((n, batchDoc) => R.over(L.count, R.add(n))(batchDoc));
const incAndSaveCount = (batchDoc) => R.compose(put, addCount(1))(batchDoc);
const decAndSaveCount = (batchDoc) => R.compose(put, addCount(-1))(batchDoc);

export { getAll, create, remove, removeAll, updateAllRemind, incAndSaveCount, decAndSaveCount };
