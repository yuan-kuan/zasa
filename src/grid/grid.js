import * as R from 'ramda';

import * as free from '../free_monad';
import { setRef } from '../ref';
import { setGridUrl } from '../router';
import { addSop } from '../sop';
import { viewMainPage } from '../view/view_store';

import Grid from './Grid.svelte';
import * as gridStore from './grid_store';
import { goToItem, goToItemCreation } from '../item/item';
import { getAllItemWithBlob } from '../item/item_utils';
import {
  makeFilterSelectionOption,
  makeTagFilterDesignDoc,
  queryResultToTagSelection,
} from './grid_utils';
import { put, query } from '../database';
import * as kv from '../kv';

const setup = () =>
  put(makeTagFilterDesignDoc()).call(free.bichain(free.of, free.of));

const getSavedTagFilter = () =>
  free
    .of('filteringTags') //
    .chain(kv.get)
    .map(R.defaultTo('[]'))
    .map(JSON.parse);

const performAddTagFilter = (tag) =>
  getSavedTagFilter()
    .map(R.append(tag))
    .map(JSON.stringify)
    .chain(kv.set('filteringTags'))
    .chain((_) => presentFilter());

const performRemoveTagFilter = (tag) =>
  getSavedTagFilter()
    .map(R.without([tag]))
    .map(JSON.stringify)
    .chain(kv.set('filteringTags'))
    .chain((_) => presentFilter());

const presentFilter = () =>
  getSavedTagFilter().chain((tags) =>
    free.sequence([
      setRef(gridStore.filteringTags, tags),
      setRef(
        gridStore.performRemoveTagFromFilter,
        R.map((tag) => () => addSop(() => performRemoveTagFilter(tag)), tags)
      ),
    ])
  );

const presentTagSelection = () =>
  free
    .of(makeFilterSelectionOption()) //
    .chain(query('tagFilter'))
    .map(queryResultToTagSelection)
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

const presentGoToItems = (itemWithBlobs) =>
  free
    .of(itemWithBlobs) //
    .map(R.map((ivb) => () => addSop(() => goToItem(ivb.itemId))))
    .chain(setRef(gridStore.goToItem));

const presentItemGrid = () =>
  getAllItemWithBlob() //
    .chain((itemWithBlobs) =>
      free.sequence([
        presentGoToItems(itemWithBlobs),
        setRef(gridStore.items, itemWithBlobs),
      ])
    );

const goToGrid = (category) =>
  free.sequence([
    viewMainPage(Grid),
    setGridUrl(category),
    presentFilter(),
    presentTagSelection(),
    presentItemGrid(),
    setRef(gridStore.goToCreateItem, () => addSop(() => goToItemCreation())),
  ]);

export { goToGrid, setup as gridSetup };
