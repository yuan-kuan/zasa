import daggy from 'daggy';
import Future from 'fluture';
import PouchDB from 'pouchdb';
import * as R from 'ramda';

import { lift } from './free_monad';
import { registerStaticInterpretor } from './sop';

const pouchdb = new PouchDB('zasa-test');
const buffer = {};

const Database = daggy.taggedSum('Database', {
  Get: ['id'],
  GetAll: [''],
  Create: ['doc'],
  Attach: ['doc', 'filename', 'blob'],
});
const { Get, GetAll, Create, Attach } = Database;

const databaseToFuture = (p) =>
  p.cata({
    Get: (id) =>
      Future((reject, resolve) => {
        pouchdb.get(id).then(resolve);
        return () => {};
      }).catch(reject),

    GetAll: () =>
      Future((reject, resolve) => {
        pouchdb
          .allDocs({
            include_docs: true,
            attachments: true,
            binary: true,
          })
          .then((result) => {
            resolve(
              R.pipe(
                R.prop('rows'),
                R.pluck('doc'),
                R.map((doc) => {
                  var blob;
                  if (doc._attachments) {
                    blob = Object.values(doc._attachments).pop().data;
                  }
                  return { name: doc.name, blob };
                })
              )(result)
            );
          })
          .catch(reject);
        return () => {};
      }),

    Create: (doc) =>
      Future((reject, resolve) => {
        pouchdb
          .post(doc)
          .then(({ id, rev }) => {
            doc._id = id;
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

const get = (id) => lift(Get(id));
const getAll = () => lift(GetAll(null));
const create = (doc) => lift(Create(doc));
const attach = (doc, filename, blob) => lift(Attach(doc, filename, blob));

export { get, getAll, create, attach };
