import * as R from 'ramda';

import * as free from '../free_monad';
import { addSop } from '../sop';
import { setRef } from '../ref';
import { setItemCreationUrl, setItemUrl } from '../router';
import { viewMainPage } from '../view/view_store';

import Item from './Item.svelte';
import ItemCreation from './ItemCreation.svelte';
import * as itemStore from './item_store.js';
import { attach, put, get, alldocs, getWithAttachment } from '../database';
import {
  makeItemDoc,
  L as ItemL,
  makeBatchDoc,
  addBatch,
  addTag,
  removeTag,
  makeGetBatchesAllDocOption,
  docToItemWithBlob,
} from './item_utils';
import { randomFourCharacter, tapLog } from '../utils';
import { remove } from '../db_ops';
import { getAllTags } from '../grid/filter';

const performCreateItem = (name, blob) =>
  free
    .of(makeItemDoc) //
    .ap(free.of(name))
    .ap(randomFourCharacter())
    .chain(put)
    .chain((doc) => {
      if (blob) {
        return attach(doc, `image`, blob).map((_) => doc._id);
      } else {
        return free.of(doc._id);
      }
    })
    .chain(goToItem);

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

const performEditName = (itemId, name) =>
  free
    .of(itemId) //
    .chain(get)
    .map(R.set(ItemL.name, name))
    .chain(put)
    .map(R.view(ItemL.name))
    .chain(setRef(itemStore.name));

const performAddBatch = (itemId, expiryDate, count) => {
  return free
    .of(makeBatchDoc(itemId, expiryDate)) //
    .map(addBatch(count))
    .chain(put)
    .chain((_) => presentBatches(itemId));
};

const performDeleteBatch = (itemId, batchId) =>
  free
    .of(batchId) //
    .chain(remove)
    .chain((_) => presentBatches(itemId));

const makeDeleteBatch = (itemId, batches) =>
  R.map((batch) => () => addSop(() => performDeleteBatch(itemId, batch._id)))(
    batches
  );

const performBatchCounting = (itemId, batchId, value) =>
  free
    .of(batchId) //
    .chain(get)
    .map(addBatch(value))
    .chain(put)
    .chain((_) => presentBatches(itemId));

const makeBatchAdd = (itemId, value, batches) =>
  R.map(
    (batch) => () =>
      addSop(() => performBatchCounting(itemId, batch._id, value))
  )(batches);

const presentBatches = (itemId) =>
  free
    .of(itemId) //
    .map(makeGetBatchesAllDocOption)
    .chain(alldocs)
    .chain((batches) =>
      free.sequence([
        setRef(itemStore.batches, batches),
        setRef(itemStore.performBatchInc, makeBatchAdd(itemId, 1, batches)),
        setRef(itemStore.performBatchDec, makeBatchAdd(itemId, -1, batches)),
        setRef(itemStore.performDeleteBatch, makeDeleteBatch(itemId, batches)),
      ])
    );

const performAddNewTag = (itemId, tag) =>
  free
    .of(itemId) //
    .chain(get)
    .map(addTag(tag))
    .chain(put)
    .chain(presentItemTags);

const performRemoveTag = (itemId, tag) =>
  free
    .of(itemId) //
    .chain(get)
    .map(removeTag(tag))
    .chain(put)
    .chain(presentItemTags);

const presentTagSelections = (itemId, existingTags) =>
  getAllTags()
    .map(R.without(existingTags))
    .chain((selections) =>
      free.sequence([
        setRef(itemStore.tagSelections, selections),
        setRef(
          itemStore.performAddTag,
          R.map(
            (selection) => () =>
              addSop(() => performAddNewTag(itemId, selection)),
            selections
          )
        ),
      ])
    );

const presentItemTags = (itemDoc) =>
  free
    .of(itemDoc) //
    .map(R.view(ItemL.tags))
    .map(R.defaultTo([]))
    .chain((tags) =>
      free.sequence([
        setRef(itemStore.tags, tags),
        setRef(
          itemStore.performRemoveTag,
          R.map(
            (tag) => () =>
              addSop(() => performRemoveTag(R.view(ItemL.id, itemDoc), tag))
          )(tags)
        ),
        presentTagSelections(R.view(ItemL.id, itemDoc), tags),
      ])
    );

const presentTags = (itemId) =>
  free
    .of(itemId) //
    .chain(get)
    .chain(presentItemTags);

const presentItem = (itemId) =>
  free
    .of(itemId) //
    .chain(getWithAttachment)
    .map(docToItemWithBlob)
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
    setRef(itemStore.performAddBatch, (expiryDate, count) =>
      addSop(() => performAddBatch(itemId, expiryDate, count))
    ),
    setRef(itemStore.performAddNewTag, (tag) =>
      addSop(() => performAddNewTag(itemId, tag))
    ),
    presentItem(itemId),
    presentBatches(itemId),
    presentTags(itemId),
  ]);

export { goToItem, goToItemCreation };
