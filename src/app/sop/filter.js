import * as R from 'ramda';
import * as free from 'fp/free';

import { createIndex, find, put, query } from '../database';
import { tapLog } from '../utils';
import {
  makeMapWithKeysForDocAttachmentQueryOption,
  makeReduceByGroupQueryOption,
} from '../db_ops';
import * as kv from '../kv';
import { docToItemWithBlob } from './item_utils';
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

const makeExpiryIndexDoc = () => {
  return {
    index: {
      fields: ['expiry'],
      name: 'sort_expiry'
    }
  }
}

const makeSortByExpiryOptions = (expiry) => {
  return {
    selector: {
      type: {
        $eq: 'b'
      },
      expiry: {
        $lt: expiry
      }
    },
    sort: [
      "expiry"
    ]
  };
}
const findExpiringItem = (expiry) => find(makeSortByExpiryOptions(expiry))

const getSavedTagFilter = () => kv.get([], 'filteringTags');
const setSavedTagFilter = (tags) => kv.set('filteringTags', tags);

const updateSavedTagFilter = (modifier) =>
  getSavedTagFilter().map(modifier).chain(setSavedTagFilter);

const addFilterTag = (tag) =>
  updateSavedTagFilter(R.append(tag));

const removeFilterTag = (tag) =>
  updateSavedTagFilter(R.without([tag]));

const setupTagFilter = () =>
  free.sequence([
    put(makeTagFilterDesignDoc()).call(free.bichain(free.of, free.of)),
    // createIndex(makeExpiryIndexDoc())
  ]);

const queryTagFilter = (options) => query('tagFilter', options)
const queryResultToTagSelection = (rows) => R.pluck('key', rows);

const getAllTags = () =>
  free
    .of(makeReduceByGroupQueryOption()) //
    .chain(queryTagFilter)
    .map(queryResultToTagSelection);

const queryResultToItem = (rows) =>
  R.pipe(
    R.uniqBy(R.prop('id')),
    R.pluck('doc'),
    R.map(docToItemWithBlob)
  )(rows);

const getItemsWithTags = (tags) =>
  free
    .of(tags) //
    .map(makeMapWithKeysForDocAttachmentQueryOption)
    .chain(queryTagFilter)
    .map(queryResultToItem);

// const getItemsExpiringBefore = (expiry) =>
//   free.of(expiry) //
//     .chain(findExpiringItem)

// export const filterInterpretor = [Filter, filterToFuture];
export {
  setupTagFilter,
  addFilterTag,
  removeFilterTag,
  getSavedTagFilter,
  updateSavedTagFilter,
  getAllTags,
  getItemsWithTags,
  // getItemsExpiringBefore,
};
