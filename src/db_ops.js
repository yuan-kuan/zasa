import * as R from 'ramda';
import * as free from './free_monad';
import * as pouch from './database';

const L = {
  includeDoc: R.lensProp('include_docs'),
  attachments: R.lensProp('attachments'),
  binary: R.lensProp('binary'),
  deleted: R.lensProp('_deleted'),
};

const makeStartEndRangeAllDocOption = (key) =>
  R.pipe(
    R.applySpec({ startkey: R.identity, endkey: (v) => `${v}\ufff0` }),
    R.set(L.includeDoc, true)
  )(key);

const makeStartEndRangeAllDocOptionAttached = (key) =>
  R.pipe(
    R.set(L.attachments, true),
    R.set(L.binary, true)
  )(makeStartEndRangeAllDocOption(key));

const remove = (id) =>
  free
    .of(id) //
    .chain(pouch.get)
    .map(R.set(L.deleted, true))
    .chain(pouch.put);

export {
  makeStartEndRangeAllDocOption,
  makeStartEndRangeAllDocOptionAttached,
  remove,
};
