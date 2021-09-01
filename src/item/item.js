import * as free from '../free_monad';
import { addSop } from '../sop';
import { setRef } from '../ref';
import { setItemCreationUrl, setItemUrl } from '../router';
import { viewMainPage } from '../view/view_store';

import Item from './Item.svelte';
import * as itemStore from './item_store.js';
import { goToGrid } from '../grid/grid';
import { attach, create, get } from '../database';
import { makeItemDoc } from './item_utils';
import { randomFourCharacter } from '../utils';

const performSaveItem = (name, blob) => {
  const creation = free
    .of(makeItemDoc) //
    .ap(free.of(name))
    .ap(randomFourCharacter())
    .chain(create)
    .chain((doc) => attach(doc, `image`, blob));

  return free.sequence([creation, goToGrid('default')]);
};

const goToItemCreation = () =>
  free.sequence([
    viewMainPage(Item),
    setItemCreationUrl(),
    setRef(itemStore.isCreation, true),
    setRef(itemStore.name, ''),
    setRef(itemStore.nameError, null),
    setRef(itemStore.performSave, (name, photoId) =>
      addSop(() => performSaveItem(name, photoId))
    ),
  ]);

const presentItem = (itemId) =>
  free
    .of(itemId) //
    .chain(get)
    .chain((itemWithBlob) =>
      free.sequence([
        setRef(itemStore.name, itemWithBlob.name),
        setRef(itemStore.photoBlob, itemWithBlob.blob),
      ])
    );

const goToItem = (itemId) =>
  free.sequence([
    viewMainPage(Item),
    setItemUrl(itemId),
    setRef(itemStore.isCreation, false),
    setRef(itemStore.nameError, null),
    presentItem(itemId),
  ]);

export { goToItem, goToItemCreation };
