import * as R from 'ramda';

import * as free from '../free_monad';
import { setRef } from '../ref';
import { setGridUrl } from '../router';
import { addSop } from '../sop';
import { viewMainPage } from '../view/view_store';

import Grid from './Grid.svelte';
import * as gridStore from './grid_store';
import { goToItem, goToItemCreation } from '../item/item';
import { alldocs } from '../database';
import { tapLog } from '../utils';
import { makeStartEndRangeAllDocOptionAttached } from '../db_ops';
import { docToItemWithBlob } from '../item/item_utils';
import {
  getAllTags,
  getItemsWithTags,
  getSavedTagFilter,
  setupTagFilter,
  updateSavedTagFilter,
} from './filter';

const setup = () => setupTagFilter();

const presentGoToItems = (itemWithBlobs) =>
  free
    .of(itemWithBlobs) //
    .map(R.map((ivb) => () => addSop(() => goToItem(ivb.itemId))))
    .chain(setRef(gridStore.goToItem));

const presentAllItems = (_) =>
  free
    // TODo: i_ is too much detail to be here.
    .of(makeStartEndRangeAllDocOptionAttached('i_'))
    .chain(alldocs)
    .map(R.map(docToItemWithBlob))
    .chain(setRef(gridStore.items));

const presentFilteredItem = (filterTags) =>
  free
    .of(filterTags)
    .chain(getItemsWithTags)
    .chain((items) =>
      free.sequence([setRef(gridStore.items, items), presentGoToItems(items)])
    );

const performAddTagFilter = (tag) =>
  free.sequence([updateSavedTagFilter(R.append(tag)), presentFilterAndItem()]);

const performRemoveTagFilter = (tag) =>
  free.sequence([
    updateSavedTagFilter(R.without([tag])),
    presentFilterAndItem(),
  ]);

const presentTagSelection = (selectedTags) =>
  getAllTags()
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

const presentItems = () =>
  getSavedTagFilter().chain(
    R.ifElse(R.isEmpty, presentAllItems, presentFilteredItem)
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

const presentFilterAndItem = () =>
  free.sequence([presentFilter(), presentItems()]);

const goToGrid = (category) =>
  free.sequence([
    viewMainPage(Grid),
    setGridUrl(category),
    presentFilterAndItem(),
    setRef(gridStore.goToCreateItem, () => addSop(() => goToItemCreation())),
  ]);

export { goToGrid, setup as gridSetup };
