import * as R from 'ramda';

const L = {
  id: R.lensProp('_id'),
  itemId: R.lensProp('itemId'),
  name: R.lensProp('name'),
  blob: R.lensProp('blob'),
};

const toSnakeCase = R.compose(R.replace(/[ ]/g, '-'), R.toLower, R.trim);

const makeItemId = (name, hash) => `i_${toSnakeCase(name)}-${hash}`;

const convertItemIdToBatchId = (itemId) => itemId.replace('i', 'b');
const convertBatchIdToItemId = (batchId) => batchId.replace('b', 'i').substring(0, batchId.indexOf(':'));

const ymdOnly = (date) =>
  R.converge(
    (y, m, d) => y * 10000 + m * 100 + d,
    [(d) => d.getFullYear(), (d) => d.getMonth() + 1, (d) => d.getDate()]
  )(date);

const makeBatchId = (itemId, expiryDate) => `${convertItemIdToBatchId(itemId)}:${ymdOnly(expiryDate)}`

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
  makeItemId,
  makeBatchId,
  convertItemIdToBatchId,
  convertBatchIdToItemId,
  docToItemWithBlob,
};
