import * as R from 'ramda';
import { query } from '../database';
import * as free from '../free_monad';
import { docToItemWithBlob } from '../item/item_utils';
import * as kv from '../kv';

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

const getSavedTagFilter = () => kv.get([], 'filteringTags');

const updateSavedTagFilter = (modifier) =>
  getSavedTagFilter().map(modifier).chain(kv.set('filteringTags'));

const makeFilterSelectionOption = () => {
  return { group: true };
};

const queryResultToTagSelection = (rows) => R.pluck('key', rows);

const getAllTags = () =>
  free
    .of(makeFilterSelectionOption()) //
    .chain(query('tagFilter'))
    .map(queryResultToTagSelection);

const makeFilterWithTagOption = (tags) => {
  return {
    reduce: false,
    keys: tags,
    include_docs: true,
    attachments: true,
    binary: true,
  };
};

const queryResultToItem = (rows) =>
  R.pipe(
    R.uniqBy(R.prop('id')),
    R.pluck('doc'),
    R.map(docToItemWithBlob)
  )(rows);

const getItemsWithTags = (tags) =>
  free
    .of(tags) //
    .map(makeFilterWithTagOption)
    .chain(query('tagFilter'))
    .map(queryResultToItem);

export {
  makeTagFilterDesignDoc,
  getSavedTagFilter,
  updateSavedTagFilter,
  getAllTags,
  getItemsWithTags,
};
