import * as R from 'ramda';

const L = {
  id: R.lensProp('_id'),
  map: R.lensPath(['views', 'tagFilter', 'map']),
  reduce: R.lensPath(['views', 'tagFilter', 'reduce']),
};

const makeTagFilterDesignDoc = () =>
  R.pipe(
    R.set(L.id, '_design/tagFilter'),
    R.set(L.reduce, '_count'),
    R.set(
      L.map,
      function (doc) {
        if (doc.type == 'i') {
          let tags = doc.tags;
          if (tags !== undefined) {
            tags.forEach((tag) => emit(tag, null));
          }
        }
      }.toString()
    )
  )({});

const makeFilterWithTagOption = (tag) => {
  return { group: true };
};

const makeFilterSelectionOption = () => {
  return { group: true };
};

const queryResultToTagSelection = (rows) => R.pluck('key', rows);

export {
  makeTagFilterDesignDoc,
  makeFilterWithTagOption,
  makeFilterSelectionOption,
  queryResultToTagSelection,
};
