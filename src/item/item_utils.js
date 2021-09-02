import * as R from 'ramda';

const L = {
  id: R.lensProp('_id'),
  name: R.lensProp('name'),
  expiry: R.lensProp('expiry'),
  type: R.lensProp('type'),
  count: R.lensProp('count'),
};

const toSnakeCase = R.compose(R.replace(/[ ]/g, '-'), R.toLower, R.trim);

const makeItemDoc = R.curry((name, postHash) =>
  R.pipe(
    R.set(L.id, R.compose((sc) => `${sc}-${postHash}`, toSnakeCase)(name)),
    R.set(L.name, R.trim(name)),
    R.set(L.type, 'i')
  )({})
);

const ymdOnly = (date) =>
  R.converge(
    (y, m, d) => y * 10000 + m * 100 + d,
    [(d) => d.getFullYear(), (d) => d.getMonth() + 1, (d) => d.getDate()]
  )(date);

const makeBatchDoc = R.curry((itemId, expiryDate) =>
  R.pipe(
    R.set(L.id, `${itemId}:${ymdOnly(expiryDate)}`),
    R.set(L.expiry, ymdOnly(expiryDate)),
    R.set(L.type, 'b'),
    R.set(L.count, 0)
  )({})
);

const addBatch = R.curry((n, batchDoc) => R.over(L.count, R.add(n))(batchDoc));

export { addBatch, makeBatchDoc, makeItemDoc, L };
