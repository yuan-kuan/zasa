import * as R from 'ramda';

import * as free from '../free_monad';
import { setRef } from '../ref';
import { setGridUrl } from '../router';
import { addSop } from '../sop';
import { viewMainPage } from '../view/view_store';

import Grid from './Grid.svelte';
import * as gridStore from './grid_store';
import { goToItem, goToItemCreation } from '../item/item';
import {
  makeFilterSelectionOption,
  makeFilterWithTagOption,
  makeTagFilterDesignDoc,
  queryResultToItem,
  queryResultToTagSelection,
} from './grid_utils';
import { alldocs, put, query } from '../database';
import * as kv from '../kv';
import { tapLog } from '../utils';
import { makeStartEndRangeAllDocOptionAttached } from '../db_ops';
import { docToItemWithBlob } from '../item/item_utils';

const setup = () =>
  put(makeTagFilterDesignDoc()).call(free.bichain(free.of, free.of));

const presentGoToItems = (itemWithBlobs) =>
  free
    .of(itemWithBlobs) //
    .map(R.map((ivb) => () => addSop(() => goToItem(ivb.itemId))))
    .chain(setRef(gridStore.goToItem));

const presentItems = () =>
  getSavedTagFilter().chain(
    R.ifElse(R.isEmpty, presentAllItems, presentFilteredItem)
    // presentFilteredItem
  );

const presentAllItems = (_) =>
  free
    .of(makeStartEndRangeAllDocOptionAttached('i_'))
    .map(tapLog('option'))
    .chain(alldocs)
    .map(tapLog('alldocs'))
    .map(R.map(docToItemWithBlob))
    .chain(setRef(gridStore.items));

const presentFilteredItem = (filterTags) =>
  free
    .of(filterTags) //
    .map(makeFilterWithTagOption)
    .chain(query('tagFilter'))
    .map(queryResultToItem)
    .chain((items) =>
      free.sequence([setRef(gridStore.items, items), presentGoToItems(items)])
    );

const getSavedTagFilter = () => kv.get([], 'filteringTags');

const performAddTagFilter = (tag) =>
  getSavedTagFilter()
    .map(R.append(tag))
    .chain(kv.set('filteringTags'))
    .chain((_) => free.sequence([presentFilter(), presentItems()]));

const performRemoveTagFilter = (tag) =>
  getSavedTagFilter()
    .map(R.without([tag]))
    .chain(kv.set('filteringTags'))
    .chain((_) => free.sequence([presentFilter(), presentItems()]));

const presentTagSelection = (selectedTags) =>
  free
    .of(makeFilterSelectionOption()) //
    .chain(query('tagFilter'))
    .map(queryResultToTagSelection)
    .map(R.without(selectedTags))
    .chain((selections) =>
      free.sequence([
        setRef(gridStore.tagSelections, selections),
        setRef(
          gridStore.performAddTagToFilter,
          R.map(
            (selection) => () => addSop(() => performAddTagFilter(selection)),
            selections
          )
        ),
      ])
    );

const presentFilter = () =>
  getSavedTagFilter().chain((tags) =>
    free.sequence([
      presentTagSelection(tags),
      setRef(gridStore.filteringTags, tags),
      setRef(
        gridStore.performRemoveTagFromFilter,
        R.map((tag) => () => addSop(() => performRemoveTagFilter(tag)), tags)
      ),
    ])
  );

const goToGrid = (category) =>
  free.sequence([
    viewMainPage(Grid),
    setGridUrl(category),
    presentFilter(),
    presentItems(),
    setRef(gridStore.goToCreateItem, () => addSop(() => goToItemCreation())),
  ]);

export { goToGrid, setup as gridSetup };
