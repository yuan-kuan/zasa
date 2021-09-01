import daggy from 'daggy';
import Future from 'fluture';
import PouchDB from 'pouchdb';
import * as R from 'ramda';

import { lift } from './free_monad';
import { registerStaticInterpretor } from './sop';

const pouchdb = new PouchDB('zasa-test');

const Database = daggy.taggedSum('Database', {
  Get: ['id', 'withAttachment'],
  GetAll: [''],
  Put: ['doc'],
  Attach: ['doc', 'filename', 'blob'],
});
const { Get, GetAll, Put, Attach } = Database;

const databaseToFuture = (p) =>
  p.cata({
    Get: (id, withAttachment) =>
      Future((reject, resolve) => {
        const option = withAttachment
          ? { attachments: true, binary: true }
          : {};
        pouchdb.get(id, option).then(resolve).catch(reject);
        return () => {};
      }),

    GetAll: () =>
      Future((reject, resolve) => {
        pouchdb
          .allDocs({
            include_docs: true,
            attachments: true,
            binary: true,
          })
          .then((result) => {
            resolve(R.compose(R.pluck('doc'), R.prop('rows'))(result));
          })
          .catch(reject);
        return () => {};
      }),

    Put: (doc) =>
      Future((reject, resolve) => {
        pouchdb
          .put(doc)
          .then(({ rev }) => {
            doc._rev = rev;
            resolve(doc);
          })
          .catch(reject);

        return () => {};
      }),

    Attach: (doc, filename, blob) =>
      Future((reject, resolve) => {
        pouchdb
          .putAttachment(doc._id, filename, doc._rev, blob, 'image/jpg')
          .then(resolve)
          .catch(reject);
        return () => {};
      }),
  });

registerStaticInterpretor([Database, databaseToFuture]);

const get = (id) => lift(Get(id, false));
const getWithAttachment = (id) => lift(Get(id, true));
const getAll = () => lift(GetAll(null));
const create = (doc) => lift(Put(doc));
const attach = (doc, filename, blob) => lift(Attach(doc, filename, blob));

export { get, getWithAttachment, getAll, create, attach };
