import * as free from '../free_monad';
import { addSop } from '../sop';
import { setRef } from '../ref';
import { setGridUrl } from '../router';
import { viewMainPage } from '../view/view_store';

import Grid from './Grid.svelte';
import * as gridStore from './grid_store';
import { goToItem } from '../item/item';
import { getAll } from '../database';

const presentItemGrid = (category) =>
  getAll() //
    .chain((entries) => setRef(gridStore.items, entries));

const goToGrid = (category) =>
  free.sequence([
    viewMainPage(Grid),
    setGridUrl(category),
    presentItemGrid(category),
    setRef(gridStore.categoryName, category),
    setRef(gridStore.goToCreateItem, () =>
      addSop(() => goToItem('fake-item-id'))
    ),
  ]);

export { goToGrid };
