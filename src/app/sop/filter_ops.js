import * as R from 'ramda';
import * as free from 'fp/free';

import { allDocs, createIndex, find, put, query } from '../database';
import { tapLog } from '../utils';
import {
  makeKeysAllDocOptionAttached,
  makeMapWithKeysForDocAttachmentQueryOption,
  makeReduceByGroupQueryOption,
} from '../db_ops';
import * as kv from '../kv';
import { convertBatchIdToItemId, docToItemWithBlob } from './item_utils';
const L = {
  id: R.lensProp('_id'),
  expiry: R.lensProp('expiry'),
  tags: R.lensProp('tags'),
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

const makeRemindIndexDoc = () => {
  return {
    index: {
      fields: ['expiry', 'remind'],
      name: 'sort_remind'
    }
  }
}

const makeSortByRemindOptions = (remind) => {
  return {
    selector: {
      type: {
        $eq: 'b'
      },
      remind: {
        $lt: remind
      },
      expiry: {
        $gt: 0
      }
    },
    sort: [
      "expiry", "remind"
    ],
    fields: [
      "_id", "expiry"
    ]
  };
}

const getSavedTagFilter = () =>
  kv.get([], 'filteringTags')
    .chain(
      R.ifElse(
        R.isEmpty,
        free.left,
        free.right,
      ));

const setSavedTagFilter = (tags) => kv.set('filteringTags', tags);

const updateSavedTagFilter = (modifier) =>
  getSavedTagFilter()
    .call(free.bimap(modifier, modifier))
    .chain(setSavedTagFilter);

const addFilterTag = (tag) =>
  updateSavedTagFilter(R.append(tag));

const removeFilterTag = (tag) =>
  updateSavedTagFilter(R.without([tag]));

const setup = () =>
  free.sequence([
    put(makeTagFilterDesignDoc()).call(free.bichain(free.of, free.of)),
    createIndex(makeRemindIndexDoc())
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

const hasExpiringFlag = () => kv.get(false, 'hasExpiringFlag')
  .chain(R.ifElse(R.identity, free.right, free.left));

const setExpiringFlag = (toggle) => kv.set('hasExpiringFlag', toggle);

const todayInMs = () => (new Date()).valueOf();

const findExpiringItemIdAndExpiry = () =>
  free.of(todayInMs())
    .map(makeSortByRemindOptions)
    .chain(find)
    .map(R.uniqBy(R.compose(convertBatchIdToItemId, R.view(L.id))))

const indexedMap = R.addIndex(R.map);

const getExpiringItems = (tagFilter = R.identity) =>
  findExpiringItemIdAndExpiry()
    .chain((itemIdAndExpirys) =>
      free.of(itemIdAndExpirys)
        .map(R.pluck('_id'))
        .map(R.map(convertBatchIdToItemId))
        .map(makeKeysAllDocOptionAttached)
        .chain(allDocs)
        .map(R.filter(tagFilter))
        .map(R.map(docToItemWithBlob))
        .map(indexedMap((doc, index) =>
          R.set(L.expiry, R.view(L.expiry, R.prop(index, itemIdAndExpirys)))(doc)
        ))
    )

const getExpiringItemsWithTags = (tags) =>
  getExpiringItems(
    R.compose(R.not, R.isEmpty, R.intersection(tags), R.defaultTo([]), R.view(L.tags))
  );

const getExpiringItemCount = () =>
  findExpiringItemIdAndExpiry().map(R.length);

export {
  setup,
  addFilterTag,
  removeFilterTag,
  getSavedTagFilter,
  updateSavedTagFilter,
  getAllTags,
  getItemsWithTags,

  hasExpiringFlag,
  setExpiringFlag,
  getExpiringItems,
  getExpiringItemCount,
  getExpiringItemsWithTags,
};
