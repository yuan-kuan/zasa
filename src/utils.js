import daggy from 'daggy';
import { resolve } from 'fluture';
import * as R from 'ramda';

import { lift } from './free_monad';
import { registerStaticInterpretor } from './sop';

const Utils = daggy.taggedSum('Utils', {
  Random: [''],
  Reload: [''],
});
const { Random, Reload } = Utils;

const utilsToFuture = (p) =>
  p.cata({
    Random: (_) => resolve(Math.random()),
    Reload: (_) => resolve(window.location.reload()),
  });

registerStaticInterpretor([Utils, utilsToFuture]);

const random = () => lift(Random(null));
const reload = () => lift(Reload(null));

const atMostFourChar = R.pipe(
  R.multiply(36 * 36 * 36 * 36),
  Math.floor,
  (num) => num.toString(36),
  R.take(4)
);

const randomFourCharacter = () => random().map(atMostFourChar);

const tapLog = (label) =>
  R.tap((o) => console.log(`${label}: ${JSON.stringify(o)}`));

export { atMostFourChar, randomFourCharacter, tapLog, reload };
