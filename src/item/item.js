import * as free from '../free_monad';
import { addSop } from '../sop';
import { setRef } from '../ref';
import { setItemUrl } from '../router';
import { viewMainPage } from '../view/view_store';

import Item from './Item.svelte';
import * as itemStore from './item_store.js';
import { goToGrid } from '../grid/grid';

const goToItem = (itemId) =>
  free.sequence([
    viewMainPage(Item),
    setItemUrl(itemId),
    setRef(itemStore.name, `item with id(${itemId})`),
    setRef(itemStore.performSave, () =>
      addSop(() => goToGrid('fake-category'))
    ),
  ]);

export { goToItem };
