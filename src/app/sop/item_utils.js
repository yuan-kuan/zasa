import * as R from 'ramda';
import { makeStartEndRangeAllDocOption } from '../db_ops';

const L = {
  id: R.lensProp('_id'),
  itemId: R.lensProp('itemId'),
  name: R.lensProp('name'),
  blob: R.lensProp('blob'),
  expiry: R.lensProp('expiry'),
  type: R.lensProp('type'),
  count: R.lensProp('count'),
  tags: R.lensProp('tags'),
  deleted: R.lensProp('_deleted')
};

const convertItemIdToBatchId = (itemId) => itemId.replace('i', 'b');

const toSnakeCase = R.compose(R.replace(/[ ]/g, '-'), R.toLower, R.trim);
const makeItemDoc = R.curry((name, postHash) =>
  R.pipe(
    R.set(L.id, R.compose((sc) => `i_${sc}-${postHash}`, toSnakeCase)(name)),
    R.set(L.name, R.trim(name)),
    R.set(L.type, 'i')
  )({})
);

const ymdOnly = (date) =>
  R.converge(
    (y, m, d) => y * 10000 + m * 100 + d,
    [(d) => d.getFullYear(), (d) => d.getMonth() + 1, (d) => d.getDate()]
  )(date);

const makeBatchDoc = R.curry((itemId, expiryDate) =>
  R.pipe(
    R.set(L.id, `${convertItemIdToBatchId(itemId)}:${ymdOnly(expiryDate)}`),
    R.set(L.expiry, expiryDate.valueOf()),
    R.set(L.type, 'b'),
    R.set(L.count, 0)
  )({})
);

const addBatch = R.curry((n, batchDoc) => R.over(L.count, R.add(n))(batchDoc));

const makeGetBatchesAllDocOption = (itemId) =>
  R.pipe(convertItemIdToBatchId, makeStartEndRangeAllDocOption)(itemId);

const appendTagAndSort = R.curry((tag, tags) =>
  R.pipe(R.defaultTo([]), R.append(tag), R.sortBy(R.toLower))(tags)
);

const addTag = R.curry((tag, itemDoc) =>
  R.over(L.tags, appendTagAndSort(tag), itemDoc)
);

const removeTag = R.curry((tag, itemDoc) =>
  R.over(L.tags, R.without([tag]), itemDoc)
);

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
  makeBatchDoc,
  makeItemDoc,
  docToItemWithBlob,
  makeGetBatchesAllDocOption,
  addTag,
  removeTag,
};
