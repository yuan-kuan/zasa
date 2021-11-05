import daggy from 'daggy';
import { Future, resolve } from 'fluture';
import * as R from 'ramda';

import { lift } from 'fp/free_monad';
import { registerStaticInterpretor } from 'fp/sop';

const Utils = daggy.taggedSum('Utils', {
  Random: [''],
  Reload: [''],
  FetchJson: ['url', 'options'],
});
const { Random, Reload, FetchJson } = Utils;

const utilsToFuture = (p) =>
  p.cata({
    Random: (_) => resolve(Math.random()),
    Reload: (_) => resolve(window.location.reload()),
    FetchJson: (url, options) => Future((reject, resolve) => {
      fetch(url, options).then((result) => {
        if (result.ok) {
          result.json().then(resolve);
        } else {
          result.text().then(reject);
        }
      }).catch(reject);
      return () => { };
    }),
  });

const dispatcher = [Utils, utilsToFuture];
registerStaticInterpretor(dispatcher);

const random = () => lift(Random(null));
const reload = () => lift(Reload(null));
const fetchJson = (url, options) => lift(FetchJson(url, options));

const atMostFourChar = R.pipe(
  R.multiply(36 * 36 * 36 * 36),
  Math.floor,
  (num) => num.toString(36),
  R.take(4)
);

const randomFourCharacter = () => random().map(atMostFourChar);

const tapLog = (label) =>
  R.tap((o) => console.log(`${label}: ${JSON.stringify(o)}`));

export { dispatcher, atMostFourChar, randomFourCharacter, tapLog, reload, fetchJson };
