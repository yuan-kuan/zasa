import * as R from 'ramda';

const L = {
  id: R.lensProp('_id'),
  name: R.lensProp('name'),
};

const toSnakeCase = R.compose(R.replace(/[ ]/g, '-'), R.toLower, R.trim);

const makeItemDoc = (name) => {
  return R.pipe(
    R.set(L.id, toSnakeCase(name)),
    R.set(L.name, R.trim(name))
  )({});
};

export { makeItemDoc };
