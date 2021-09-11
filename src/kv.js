import daggy from 'daggy';
import * as R from 'ramda';
import { resolve } from 'fluture';

import { lift } from './free_monad';
import { registerStaticInterpretor } from './sop';

const KV = daggy.taggedSum('KV', {
  Get: ['key'],
  Set: ['key', 'value'],
});
const { Get, Set } = KV;

const kvToFuture = (p) =>
  p.cata({
    Get: (key) => resolve(window.localStorage.getItem(key)),
    Set: (key, value) => resolve(window.localStorage.setItem(key, value)),
  });

registerStaticInterpretor([KV, kvToFuture]);

const get = (key) => lift(Get(key));
const set = R.curry((key, value) => lift(Set(key, value)));

export { get, set };
