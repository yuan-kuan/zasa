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
import { makeTagFilterDesignDoc } from './grid_utils';
import { put } from '../database';

const setup = () =>
  put(makeTagFilterDesignDoc()).call(free.bichain(free.of, free.of));

const presentGoToItems = (itemWithBlobs) =>
  free
    .of(itemWithBlobs) //
    .map(R.map((ivb) => () => addSop(() => goToItem(ivb.itemId))))
    .chain(setRef(gridStore.goToItem));

const presentItemGrid = (category) =>
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
    presentItemGrid(category),
    setRef(gridStore.categoryName, category),
    setRef(gridStore.goToCreateItem, () => addSop(() => goToItemCreation())),
  ]);

export { goToGrid, setup as gridSetup };
