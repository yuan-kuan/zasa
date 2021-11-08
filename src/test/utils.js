import PouchDB from 'pouchdb';
import { promise, resolve } from 'fluture';

import { atMostFourChar, utilsInterpretor } from 'app/utils';
import { freeUtilsInterpretor } from 'fp/free';
import { setupDatabaseInterpretor } from 'app/database';
import { dispatch } from 'fp/interpretor';

PouchDB.plugin(require('pouchdb-adapter-memory'));
const MemPouch = PouchDB.defaults({
  adapter: 'memory',
});

/// Boolean -> ( Free Monad -> Promise )
export const createTestHelper = (useDb = false) => {
  const defaultInterpretors = [utilsInterpretor, freeUtilsInterpretor];

  let interpretors;
  let db;
  let ranTest = 0;
  let randomTestId = atMostFourChar(Math.random());

  return {
    setup: () => {
      interpretors = [];
      interpretors.push(...defaultInterpretors);
      if (useDb) {
        // DO NOT try to destroy memory pouchDB instance. it is at least 3 seconds slow.
        db = MemPouch(`testmem-${randomTestId}-${ranTest++}`);
        interpretors.push(setupDatabaseInterpretor(db));
      }

      return (freeMonad) => {
        return promise(freeMonad.foldMap(dispatch(interpretors), resolve));
      };
    }
  };
}

