// @ts-ignore
import daggy from 'daggy';
import * as R from 'ramda';
import { resolve } from 'fluture';

import { lift } from 'fp/free';

const KV = daggy.taggedSum('KV', {
  Get: ['key'],
  Set: ['key', 'value'],
  Remove: ['key']
});
// @ts-ignore
const { Get, Set, Remove } = KV;

const kvToFuture = (kv) => (p) =>
  p.cata({
    Get: (key) => resolve(kv.getItem(key)),
    Set: (key, value) => resolve(kv.setItem(key, value)),
    Remove: (key) => resolve(kv.removeItem(key))
  });

const setupKVInterpretor = (memoryKV) => {
  var kv;
  if (memoryKV) {
    kv = memoryKV;
  } else {
    kv = window.localStorage;
  }

  return [KV, kvToFuture(kv)];
}

const get = R.curry((defaultValue, key) =>
  lift(Get(key)) //
    .map(R.defaultTo(JSON.stringify(defaultValue)))
    .map(JSON.parse)
);
const set = R.curry((key, value) => lift(Set(key, JSON.stringify(value))));
const remove = (key) => lift(Remove(key));

export { setupKVInterpretor, get, set, remove };
