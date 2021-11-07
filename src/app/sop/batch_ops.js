import * as R from 'ramda';
import * as free from 'fp/free';
import * as db_ops from 'app/db_ops';
import { alldocs, bulkDocs, get, put } from 'app/database';
import { tapLog } from 'app/utils';

const L = {
  id: R.lensProp('_id'),
  itemId: R.lensProp('itemId'),
  type: R.lensProp('type'),
  remindDays: R.lensProp('remindDays'),
  expiry: R.lensProp('expiry'),
  remind: R.lensProp('remind'),
  count: R.lensProp('count'),
};

const msAfterDays = (date, days) => date.valueOf() + days * 24 * 60 * 60 * 1000

const convertItemIdToBatchId = (itemId) => itemId.replace('i', 'b');

const makeGetBatchesAllDocOption = (itemId) =>
  R.pipe(convertItemIdToBatchId, db_ops.makeStartEndRangeAllDocOption)(itemId);

const getAll = (itemId) => free
  .of(itemId) //
  .map(makeGetBatchesAllDocOption)
  .chain(alldocs);

const ymdOnly = (date) =>
  R.converge(
    (y, m, d) => y * 10000 + m * 100 + d,
    [(d) => d.getFullYear(), (d) => d.getMonth() + 1, (d) => d.getDate()]
  )(date);

const makeBatchDoc = R.curry((itemId, expiryDate, days) =>
  R.pipe(
    R.set(L.id, `${convertItemIdToBatchId(itemId)}:${ymdOnly(expiryDate)}`),
    R.set(L.expiry, expiryDate.valueOf()),
    R.set(L.remind, msAfterDays(expiryDate, days)),
    R.set(L.type, 'b'),
    R.set(L.count, 1)
  )({})
);

const getRemindDays = (itemId) =>
  free
    .of(itemId)
    .chain(get)
    .map(R.view(L.remindDays))

const create = (itemId, expiryDate) =>
  free
    .of(itemId)
    .chain(getRemindDays)
    .map(makeBatchDoc(itemId, expiryDate))
    .chain(put)

const remove = (batchId) =>
  free.of(batchId)
    .chain(db_ops.remove);

const removeAll = (itemId) =>
  free.of(itemId)
    .chain(getAll)
    .chain(db_ops.removeAll)

const updateBatchRemind = R.curry((days, batchDoc) =>
  R.set(L.remind, msAfterDays(batchDoc.expiry, days), batchDoc));

const updateAllRemind = (itemId) =>
  free
    .of(R.curry((days, batches) =>
      R.map(updateBatchRemind(days), batches)
    ))
    .ap(getRemindDays(itemId))
    .ap(getAll(itemId))
    .chain(bulkDocs)

const addCount = R.curry((n, batchDoc) => R.over(L.count, R.add(n))(batchDoc));
const incAndSaveCount = (batchDoc) => R.compose(put, addCount(1))(batchDoc);
const decAndSaveCount = (batchDoc) => R.compose(put, addCount(-1))(batchDoc);

export { getAll, create, remove, removeAll, updateAllRemind, incAndSaveCount, decAndSaveCount };
