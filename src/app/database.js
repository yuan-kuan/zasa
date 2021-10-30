import daggy from 'daggy';
import Future from 'fluture';
import PouchDB from 'pouchdb';
import * as R from 'ramda';

import { lift } from 'fp/free_monad';
import { registerStaticInterpretor } from 'fp/sop';

const pouchdb = new PouchDB('zasa-test');

const Database = daggy.taggedSum('Database', {
  Get: ['id', 'withAttachment'],
  AllDocs: ['options'],
  Put: ['doc'],
  Attach: ['doc', 'filename', 'blob'],
  Query: ['index', 'options'],
  CleanUp: [''],
  Destroy: [''],
  Sync: ['targetUrl', 'options'],
});
const { Get, AllDocs, Put, Attach, Query, CleanUp, Destroy, Sync } = Database;

const databaseToFuture = (p) =>
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

registerStaticInterpretor([Database, databaseToFuture]);

const get = (id) => lift(Get(id, false));
const getWithAttachment = (id) => lift(Get(id, true));
const alldocs = (options) => lift(AllDocs(options));
const put = (doc) => lift(Put(doc));
const attach = (doc, filename, blob) => lift(Attach(doc, filename, blob));
const query = R.curry((index, options) => lift(Query(index, options)));
const cleanUp = () => lift(CleanUp(null));
const destroy = () => lift(Destroy(null));
const sync = (targetUrl, options) => lift(Sync(targetUrl, options));

export {
  get,
  getWithAttachment,
  alldocs,
  put,
  attach,
  query,
  cleanUp,
  destroy,
  sync,
};