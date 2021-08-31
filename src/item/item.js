import * as free from '../free_monad';
import { addSop } from '../sop';
import { setRef } from '../ref';
import { setItemUrl } from '../router';
import { viewMainPage } from '../view/view_store';

import Item from './Item.svelte';
import * as itemStore from './item_store.js';
import { goToGrid } from '../grid/grid';
import { attach, create } from '../database';

const performSaveItem = (name, blob) => {
  return free.sequence([
    create({ name }).chain((doc) => attach(doc, `${name}.jpg`, blob)),
    goToGrid('default'),
  ]);
};

const goToItem = (itemId) =>
  free.sequence([
    viewMainPage(Item),
    setItemUrl(itemId),
    setRef(itemStore.name, `item with id(${itemId})`),
    setRef(itemStore.performSave, (name, photoId) =>
      addSop(() => performSaveItem(name, photoId))
    ),
  ]);

export { goToItem };
