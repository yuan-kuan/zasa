import * as R from 'ramda';

import * as free from '../free_monad';
import { addSop } from '../sop';
import { setRef } from '../ref';
import { setItemCreationUrl, setItemUrl } from '../router';
import { viewMainPage } from '../view/view_store';

import Item from './Item.svelte';
import ItemCreation from './ItemCreation.svelte';
import * as itemStore from './item_store.js';
import { goToGrid } from '../grid/grid';
import { attach, put, get } from '../database';
import { makeItemDoc, L as ItemL } from './item_utils';
import { randomFourCharacter, tapLog } from '../utils';
import { getItemWithBlob } from '../db_ops';

const performEditName = (itemId, name) =>
  free
    .of(itemId) //
    .chain(get)
    .map(R.set(ItemL.name, name))
    .chain(put)
    .map(R.view(ItemL.name))
    .chain(setRef(itemStore.name));

const performCreateItem = (name, blob) => {
  let creation = free
    .of(makeItemDoc) //
    .ap(free.of(name))
    .ap(randomFourCharacter())
    .chain(put);

  if (blob) {
    creation = creation.chain((doc) => attach(doc, `image`, blob));
  }

  return free.sequence([creation, goToGrid('default')]);
};

const goToItemCreation = () =>
  free.sequence([
    viewMainPage(ItemCreation),
    setItemCreationUrl(),
    setRef(itemStore.name, ''),
    setRef(itemStore.nameError, null),
    setRef(itemStore.performSave, (name, photoId) =>
      addSop(() => performCreateItem(name, photoId))
    ),
  ]);

const presentItem = (itemId) =>
  free
    .of(itemId) //
    .chain(getItemWithBlob)
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
    setRef(itemStore.nameError, null),
    setRef(itemStore.performEditName, (newName) =>
      addSop(() => performEditName(itemId, newName))
    ),
    presentItem(itemId),
  ]);

export { goToItem, goToItemCreation };
