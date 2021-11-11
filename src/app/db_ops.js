import * as R from 'ramda';
import * as pouch from './database';

const L = {
  includeDoc: R.lensProp('include_docs'),
  attachments: R.lensProp('attachments'),
  keys: R.lensProp('keys'),
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

const makeKeysAllDocOptionAttached = (keys) =>
  R.pipe(
    R.set(L.keys, keys),
    R.set(L.includeDoc, true),
    R.set(L.attachments, true),
    R.set(L.binary, true)
  )({});

const makeReduceByGroupQueryOption = () => {
  return { group: true };
};

const makeMapWithKeysForDocAttachmentQueryOption = (keys) => {
  return {
    reduce: false,
    keys: keys,
    include_docs: true,
    attachments: true,
    binary: true,
  };
};

const syncWithBackUp = (targetUrl, username, password) =>
  pouch.sync(targetUrl, {
    auth: {
      username, password
    },
    filter: (doc) => !doc._id.startsWith('_design'),
  });

export {
  makeStartEndRangeAllDocOption,
  makeStartEndRangeAllDocOptionAttached,
  makeKeysAllDocOptionAttached,
  makeReduceByGroupQueryOption,
  makeMapWithKeysForDocAttachmentQueryOption,
  syncWithBackUp,
};
