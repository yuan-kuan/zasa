import daggy from 'daggy';
import Future from 'fluture';
import PouchDB from 'pouchdb';
import * as R from 'ramda';

import { lift } from './free_monad';
import { registerStaticInterpretor } from './sop';

const pouchdb = new PouchDB('zasa-test');

const Database = daggy.taggedSum('Database', {
  Get: ['id'],
  GetAll: [''],
  Create: ['doc'],
  Attach: ['doc', 'filename', 'blob'],
});
const { Get, GetAll, Create, Attach } = Database;

const docToItem = (doc) => {
  var blob;
  if (doc._attachments) {
    blob = Object.values(doc._attachments).pop().data;
  }
  return { itemId: doc._id, name: doc.name, blob };
};

const databaseToFuture = (p) =>
  p.cata({
    Get: (id) =>
      Future((reject, resolve) => {
        pouchdb
          .get(id, { attachments: true, binary: true })
          .then((doc) => {
            resolve(docToItem(doc));
          })
          .catch(reject);
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
            resolve(
              R.pipe(R.prop('rows'), R.pluck('doc'), R.map(docToItem))(result)
            );
          })
          .catch(reject);
        return () => {};
      }),

    Create: (doc) =>
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

const get = (id) => lift(Get(id));
const getAll = () => lift(GetAll(null));
const create = (doc) => lift(Create(doc));
const attach = (doc, filename, blob) => lift(Attach(doc, filename, blob));

export { get, getAll, create, attach };
