import * as R from 'ramda';
import { docToItemWithBlob } from '../item/item_utils';

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

const makeFilterWithTagOption = (tags) => {
  return {
    reduce: false,
    keys: tags,
    include_docs: true,
    attachments: true,
    binary: true,
  };
};

const makeFilterSelectionOption = () => {
  return { group: true };
};

const queryResultToTagSelection = (rows) => R.pluck('key', rows);

const queryResultToItem = (rows) =>
  R.pipe(R.pluck('doc'), R.map(docToItemWithBlob))(rows);

export {
  makeTagFilterDesignDoc,
  makeFilterWithTagOption,
  makeFilterSelectionOption,
  queryResultToTagSelection,
  queryResultToItem,
};
