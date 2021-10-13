import * as R from 'ramda';

import * as free from '../free_monad';
import { setRef } from '../ref';
import { setGridUrl } from '../router';
import { addSop } from '../sop';
import { viewMainPage } from '../view/view_store';

import Grid, * as gridStore from './Grid.svelte';
import * as filterStore from './Filter.svelte';

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
import { goToSettingPage } from '../setting/setting';

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
    .chain((items) =>
      free.sequence([
        setRef(gridStore.items, items),
        free.sequence([
          setRef(gridStore.items, items),
          presentGoToItems(items),
        ]),
      ])
    );

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
    .chain((tags) =>
      free.sequence([
        setRef(filterStore.filteringTags, selectedTags),
        setRef(filterStore.allTags, tags),
        setRef(filterStore.allTagsSelected, R.map((tag) => R.includes(tag, selectedTags), tags)),

        setRef(
          filterStore.performToggleTagFilter,
          R.map(
            (tag) =>
              R.ifElse(
                R.flip(R.includes)(selectedTags),
                (tag) => () => addSop(() => performRemoveTagFilter(tag)),
                (tag) => () => addSop(() => performAddTagFilter(tag)),
              )(tag),
            tags
          )
        ),
      ])
    );

const presentItems = () =>
  getSavedTagFilter().chain(
    R.ifElse(R.isEmpty, presentAllItems, presentFilteredItem)
  );

const presentFilter = () =>
  getSavedTagFilter().chain(presentTagSelection);

const presentFilterAndItem = () =>
  free.sequence([presentFilter(), presentItems()]);

const goToGrid = () =>
  free.sequence([
    viewMainPage(Grid),
    setGridUrl(),
    presentFilterAndItem(),
    setRef(gridStore.goToCreateItem, () => addSop(() => goToItemCreation())),
    setRef(gridStore.goToSetting, () => addSop(() => goToSettingPage())),
  ]);

export { goToGrid, setup as gridSetup };
