import * as free from '../free_monad';
import { addSop } from '../sop';
import { setRef } from '../ref';
import { setGridUrl } from '../router';
import { viewMainPage } from '../view/view_store';

import Grid from './Grid.svelte';
import * as gridStore from './grid_store';
import { goToItem } from '../item/item';

const goToGrid = (category) =>
  free.sequence([
    viewMainPage(Grid),
    setGridUrl(category),
    setRef(gridStore.categoryName, category),
    setRef(gridStore.goToCreateItem, () =>
      addSop(() => goToItem('fake-item-id'))
    ),
  ]);

export { goToGrid };
