import daggy from 'daggy';
import { resolve } from 'fluture';
import { lift } from './free_monad';
import { registerStaticInterpretor } from './sop';

const buffer = {};

const Database = daggy.taggedSum('Database', {
  Get: ['id'],
  GetAll: [''],
  Set: ['id', 'value'],
});
const { Get, GetAll, Set } = Database;

const databaseToFuture = (p) =>
  p.cata({
    Get: (id) => resolve(buffer[id]),
    GetAll: () => resolve(Object.entries(buffer)),
    Set: (id, value) => resolve((buffer[id] = value)),
  });

registerStaticInterpretor([Database, databaseToFuture]);

const get = (id) => lift(Get(id));
const getAll = () => lift(GetAll(null));
const set = (id, value) => lift(Set(id, value));

export { get, getAll, set };
