import daggy from 'daggy';
import Future from 'fluture';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import * as R from 'ramda';

import { lift } from 'fp/free_monad';
import { registerStaticInterpretor } from 'fp/sop';

// eslint-disable-next-line no-undef
PouchDB.plugin(PouchDBFind);

const Database = daggy.taggedSum('Database', {
  Get: ['id', 'withAttachment'],
  AllDocs: ['options'],
  Put: ['doc'],
  BulkDocs: ['docs'],
  Attach: ['doc', 'filename', 'blob'],
  Query: ['index', 'options'],
  CreateIndex: ['index'],
  Find: ['options'],
  CleanUp: [''],
  Destroy: [''],
  Sync: ['targetUrl', 'options'],
});
const { Get, AllDocs, Put, BulkDocs, Attach, Query, CleanUp, CreateIndex, Find, Destroy, Sync } = Database;

const databaseToFuture = (pouchdb) => (p) =>
  p.cata({
    Get: (id, withAttachment) =>
      Future((reject, resolve) => {
        const option = withAttachment
          ? { attachments: true, binary: true }
          : {};
        pouchdb.get(id, option).then(resolve).catch(reject);
        return () => { };
      }),

    AllDocs: (options) =>
      Future((reject, resolve) => {
        pouchdb
          .allDocs(options)
          .then((result) => {
            resolve(R.compose(R.pluck('doc'), R.prop('rows'))(result));
          })
          .catch(reject);
        return () => { };
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

        return () => { };
      }),

    BulkDocs: (docs) =>
      Future((reject, resolve) => {
        pouchdb
          .bulkDocs(docs)
          .then(resolve)
          .catch(reject);

        return () => { };
      }),

    Attach: (doc, filename, blob) =>
      Future((reject, resolve) => {
        pouchdb
          .putAttachment(doc._id, filename, doc._rev, blob, 'image/jpg')
          .then(resolve)
          .catch(reject);
        return () => { };
      }),

    Query: (index, options) =>
      Future((reject, resolve) => {
        pouchdb
          .query(index, options)
          .then(R.compose(resolve, R.prop('rows')))
          .catch(reject);
        return () => { };
      }),
    CreateIndex: (index) =>
      Future((reject, resolve) => {
        pouchdb
          .createIndex(index)
          .then(resolve)
          .catch(reject);
        return () => { };
      }),
    Find: (options) =>
      Future((reject, resolve) => {
        pouchdb
          .find(options)
          .then(R.compose(resolve, R.prop('docs')))
          .catch(reject);
        return () => { };
      }),

    CleanUp: (_) =>
      Future((reject, resolve) => {
        pouchdb
          .viewCleanup()
          .then(() => {
            pouchdb.compact();
          })
          .then(resolve)
          .catch(reject);
        return () => { };
      }),

    Destroy: (_) =>
      Future((reject, resolve) => {
        pouchdb
          .destroy()
          .then(() => {
            resolve();
          })
          .catch(reject);
        return () => { };
      }),

    Sync: (targetUrl, options) =>
      Future((reject, resolve) => {
        pouchdb.sync(targetUrl, options).then(resolve).catch(reject);
        return () => { };
      }),
  });

const setupDatabaseDispatcher = (memoryPouchdb) => {
  var pouchdb;
  if (memoryPouchdb) {
    pouchdb = memoryPouchdb;
  } else {
    //TODO: Migrate old user pouch to remote and rename this
    pouchdb = new PouchDB('zasa-test');
  }

  return [Database, databaseToFuture(pouchdb)];
}

const get = (id) => lift(Get(id, false));
const getWithAttachment = (id) => lift(Get(id, true));
const alldocs = (options) => lift(AllDocs(options));
const put = (doc) => lift(Put(doc));
const bulkDocs = (docs) => lift(BulkDocs(docs));
const attach = (doc, filename, blob) => lift(Attach(doc, filename, blob));
const query = R.curry((index, options) => lift(Query(index, options)));
const createIndex = (index) => lift(CreateIndex(index));
const find = (options) => lift(Find(options));
const cleanUp = () => lift(CleanUp(null));
const destroy = () => lift(Destroy(null));
const sync = (targetUrl, options) => lift(Sync(targetUrl, options));

export {
  setupDatabaseDispatcher,
  get,
  getWithAttachment,
  alldocs,
  put,
  bulkDocs,
  attach,
  query,
  createIndex,
  find,
  cleanUp,
  destroy,
  sync,
};
