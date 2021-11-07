import * as R from 'ramda';
import { makeStartEndRangeAllDocOption } from '../db_ops';

const L = {
  id: R.lensProp('_id'),
  itemId: R.lensProp('itemId'),
  name: R.lensProp('name'),
  blob: R.lensProp('blob'),
  remindDays: R.lensProp('remindDays'),
  expiry: R.lensProp('expiry'),
  remind: R.lensProp('remind'),
  type: R.lensProp('type'),
  count: R.lensProp('count'),
  tags: R.lensProp('tags'),
  deleted: R.lensProp('_deleted')
};

const toSnakeCase = R.compose(R.replace(/[ ]/g, '-'), R.toLower, R.trim);
const makeItemDoc = R.curry((name, postHash) =>
  R.pipe(
    R.set(L.id, R.compose((sc) => `i_${sc}-${postHash}`, toSnakeCase)(name)),
    R.set(L.name, R.trim(name)),
    R.set(L.type, 'i'),
    R.set(L.remindDays, 30)
  )({})
);

const addBatch = R.curry((n, batchDoc) => R.over(L.count, R.add(n))(batchDoc));

const updateRemindDay = R.curry((days, batchDoc) =>
  R.set(
    L.remind,
    R.compose((d) => d.setDate(d.getDate() + days).valueOf(), (v) => new Date(v), R.view(L.expiry))(batchDoc),
    batchDoc));


const makeItemWithBlob = (itemId, name, blob) =>
  R.pipe(R.set(L.itemId, itemId), R.set(L.name, name), R.set(L.blob, blob))({});

const docToItemWithBlob = (doc) => {
  var blob;
  if (doc._attachments) {
    blob = Object.values(doc._attachments).pop().data;
  }

  return makeItemWithBlob(doc._id, doc.name, blob);
};

export {
  L,
  addBatch,
  updateRemindDay,
  makeItemDoc,
  docToItemWithBlob,

};
