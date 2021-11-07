import PouchDB from 'pouchdb';
import { promise, resolve } from 'fluture';

import { utilsInterpretor } from 'app/utils';
import { freeUtilsInterpretor } from 'fp/free';
import { setupDatabaseInterpretor } from 'app/database';
import { dispatch } from 'fp/interpretor';

PouchDB.plugin(require('pouchdb-adapter-memory'));
const MemPouch = PouchDB.defaults({
  adapter: 'memory',
});

/// Boolean -> ( Free Monad -> Promise )
export const createTestInterpetor = (useDb = false) => {
  const interpretors = [utilsInterpretor, freeUtilsInterpretor];
  if (useDb) {
    interpretors.push(setupDatabaseInterpretor(MemPouch('item-test')));
  }

  return (freeMonad) => {
    return promise(freeMonad.foldMap(dispatch(interpretors), resolve));
  }
}

