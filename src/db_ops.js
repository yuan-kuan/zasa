import * as R from 'ramda';
import * as free from './free_monad';

import * as pouch from './database';

const L = {
  itemId: R.lensProp('itemId'),
  name: R.lensProp('name'),
  blob: R.lensProp('blob'),
  includeDoc: R.lensProp('include_docs'),
  deleted: R.lensProp('_deleted'),
};

const convertItemIdToBatchId = (itemId) => itemId.replace('i', 'b');

const makeItemWithBlob = (itemId, name, blob) =>
  R.pipe(R.set(L.itemId, itemId), R.set(L.name, name), R.set(L.blob, blob))({});

const docToItemWithBlob = (doc) => {
  var blob;
  if (doc._attachments) {
    blob = Object.values(doc._attachments).pop().data;
  }

  return makeItemWithBlob(doc._id, doc.name, blob);
};

const getItemWithBlob = (id) =>
  pouch.getWithAttachment(id).map(docToItemWithBlob);

const getAllItemWithBlob = () => pouch.getAll().map(R.map(docToItemWithBlob));

const makeStartEndRangeAllDocOption = (key) =>
  R.pipe(
    R.applySpec({ startkey: R.identity, endkey: (v) => `${v}\ufff0` }),
    R.set(L.includeDoc, true)
  )(key);

const getBatches = (itemId) =>
  free
    .of(itemId) //
    .map(convertItemIdToBatchId)
    .map(makeStartEndRangeAllDocOption)
    .chain(pouch.alldocs);

const remove = (id) =>
  free
    .of(id) //
    .chain(pouch.get)
    .map(R.set(L.deleted, true))
    .chain(pouch.put);

export {
  convertItemIdToBatchId,
  getItemWithBlob,
  getAllItemWithBlob,
  getBatches,
  makeStartEndRangeAllDocOption,
  remove,
};
