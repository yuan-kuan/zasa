import * as R from 'ramda';

import * as pouch from './database';

const L = {
  itemId: R.lensProp('itemId'),
  name: R.lensProp('name'),
  blob: R.lensProp('blob'),
};

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

export { getItemWithBlob, getAllItemWithBlob };
