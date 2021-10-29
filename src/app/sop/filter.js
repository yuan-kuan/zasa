import * as R from 'ramda';
import daggy from 'daggy';

import { registerStaticInterpretor } from 'fp/sop';
import * as free from 'fp/free_monad';

import { put, query } from '../database';
import {
  makeMapWithKeysForDocAttachmentQueryOption,
  makeReduceByGroupQueryOption,
} from '../db_ops';
import * as kv from '../kv';
import { docToItemWithBlob } from './item_utils';

const Filter = daggy.taggedSum('Filter', {
  GetSavedTags: [''],
  SetSavedTags: ['tags'],
  QueryTagFilter: ['options'],
  SetupTagFilter: [''],
});
const { GetSavedTags, SetSavedTags, QueryTagFilter, SetupTagFilter } = Filter;

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

const filterToFuture = (p) =>
  p.cata({
    GetSavedTags: (_) => free.interpete(kv.get([], 'filteringTags')),
    SetSavedTags: (tags) => free.interpete(kv.set('filteringTags', tags)),
    QueryTagFilter: (options) => free.interpete(query('tagFilter', options)),
    SetupTagFilter: () =>
      free.interpete(
        put(makeTagFilterDesignDoc()).call(free.bichain(free.of, free.of))
      ),
  });

registerStaticInterpretor([Filter, filterToFuture]);

const getSavedTagFilter = () => free.lift(GetSavedTags(null));
const setSavedTagFilter = (tags) => free.lift(SetSavedTags(tags));
const queryTagFilter = (options) => free.lift(QueryTagFilter(options));
const setupTagFilter = () => free.lift(SetupTagFilter(null));

const updateSavedTagFilter = (modifier) =>
  getSavedTagFilter().map(modifier).chain(setSavedTagFilter);

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

export {
  setupTagFilter,
  getSavedTagFilter,
  updateSavedTagFilter,
  getAllTags,
  getItemsWithTags,
};
