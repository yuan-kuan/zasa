// Copied from https://github.com/DrBoolean/freemonadky

import daggy from 'daggy';
import * as fluture from 'fluture';
import * as R from 'ramda';

import { registerStaticInterpretor } from './sop';

const FreeMonad = daggy.taggedSum('FreeMonad', {
  Impure: ['x', 'f'],
  Pure: ['x'],
});

const kleisli_comp = (f, g) => (x) => f(x).chain(g);

FreeMonad.prototype.fold = function () {
  return this.x.fold.apply(this.x, arguments);
};

FreeMonad.prototype.map = function (f) {
  return this.cata({
    Impure: (x, g) => FreeMonad.Impure(x, (y) => g(y).map(f)),
    Pure: (x) => FreeMonad.Pure(f(x)),
  });
};

FreeMonad.prototype.ap = function (a) {
  return this.cata({
    Impure: (x, g) => FreeMonad.Impure(x, (y) => g(y).ap(a)),
    Pure: (f) => a.map(f),
  });
};

FreeMonad.prototype.chain = function (f) {
  return this.cata({
    Impure: (x, g) => FreeMonad.Impure(x, kleisli_comp(g, f)),
    Pure: (x) => f(x),
  });
};

const of = FreeMonad.Pure; // FreeMonad.of
const lift = (command) => FreeMonad.Impure(command, FreeMonad.Pure);

FreeMonad.prototype.foldMap = function (interpreter, of) {
  return this.cata({
    Pure: (a) => of(a),
    Impure: (intruction_of_arg, next) => {
      if (FutureCommand.Parallel.is(intruction_of_arg)) {
        // Interpret each free monads in the array
        const futures = R.map(
          (fm) => fm.foldMap(interpreter, of),
          interpreter(intruction_of_arg)
        );

        // Run all interpreted Future with parallel
        return fluture.chain((result) => next(result).foldMap(interpreter, of))(
          fluture.parallel(MAX_THREAD)(futures)
        );
      } else if (FutureCommand.Bichain.is(intruction_of_arg)) {
        const [left, right, fm] = interpreter(intruction_of_arg);

        // bichain will change the outcome of the future.
        // if the chained future resolved a rejected outcome, the returned
        // future will became a resolution. Vice versa.
        return fluture.chain((result) => next(result).foldMap(interpreter, of))(
          fluture.bichain((result) => left(result).foldMap(interpreter, of))(
            (result) => right(result).foldMap(interpreter, of)
          )(fm.foldMap(interpreter, of))
        );
      } else if (FutureCommand.Bimap.is(intruction_of_arg)) {
        const [left, right, fm] = interpreter(intruction_of_arg);

        // bimap will not change the outcome of the future.
        // if it was a rejection, the returned future remains a rejection.
        return fluture.chain((result) => next(result).foldMap(interpreter, of))(
          fluture.bimap(left)(right)(fm.foldMap(interpreter, of))
        );
      } else {
        return fluture.chain((result) => next(result).foldMap(interpreter, of))(
          interpreter(intruction_of_arg)
        );
      }
    },
  });
};

const MAX_THREAD = 8;

const FutureCommand = daggy.taggedSum('FutureCommand', {
  Bichain: ['left', 'right', 'future'],
  Bimap: ['left', 'right', 'future'],
  Parallel: ['freeFutures'],
});
const { Bichain, Bimap, Parallel } = FutureCommand;

const futureCommandToFuture = (p) =>
  p.cata({
    Bichain: (left, right, freeMonad) => {
      return [left, right, freeMonad];
    },
    Bimap: (left, right, freeMonad) => {
      return [left, right, freeMonad];
    },
    Parallel: (freeMonads) => freeMonads,
  });

const futureCommandInterpretor = [FutureCommand, futureCommandToFuture];
registerStaticInterpretor(futureCommandInterpretor);

// [Free(Future)] -> Free(Future)
// This take in an array of free monads (which must interprete into Future).
// All interpreted Futures will run by Fluture's parallel command.
// See also: https://github.com/fluture-js/Fluture#parallel
const parallel = (freeMonads) => lift(Parallel(freeMonads));
const parallelConverge = R.converge((...freeMonads) => parallel(freeMonads));
const sequence = R.sequence(of);

// Function -> Function -> Free(Future) -> Free(Future)
// Map the result over `left` function if the outcome from forking freeMonad
// being rejected. Map over `right` when resolved.
//
// Outcome of the future will remain the same after the mapped function. i.e.
// rejection will remain a rejected future.
//
// See also: https://github.com/fluture-js/Fluture#bimap
const bimap = R.curry((left, right, freeMonad) =>
  lift(Bimap(left, right, freeMonad))
);

// Function -> Function -> Free(Future) -> Free(Future)
// Chain the result over `left` function if the outcome from forking freeMonad
// being rejected. Map over `right` when resolved.
//
// Outcome of the future will change back on the result of the chained function.
// i.e. If the chained future is resolved (instead of reject), a previously
// rejected result will now becomes resolved future.
//
// See also: https://github.com/fluture-js/Fluture#bichain
const bichain = R.curry((left, right, freeMonad) =>
  lift(Bichain(left, right, freeMonad))
);

export {
  lift,
  of,
  parallel,
  parallelConverge,
  sequence,
  bimap,
  bichain,
  futureCommandInterpretor,
};
