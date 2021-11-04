import * as R from 'ramda';

import * as free from 'fp/free_monad';
import { addSop } from 'fp/sop';
import { resetRef, setRef } from 'fp/ref';
import { viewMainPage } from 'fp/view_store';

import Item from 'view/item/Item.svelte';
import ItemCreation from 'view/item/ItemCreation.svelte';

import { setItemCreationUrl, setItemUrl } from '../router';
import { ItemStores, BatchStores, TagStores } from '../stores';
import * as database from '../database';
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
import { getAllTags } from './filter';
import { goToHome } from './home';

const performCreateItem = (name, blob) =>
  free
    .of(makeItemDoc) //
    .ap(free.of(name))
    .ap(randomFourCharacter())
    .chain(database.put)
    .chain((doc) => {
      if (blob) {
        return database.attach(doc, `image`, blob).map((_) => doc._id);
      } else {
        return free.of(doc._id);
      }
    })
    .chain(goToItem);

const goToItemCreation = () =>
  free.sequence([
    viewMainPage(ItemCreation),
    setItemCreationUrl(),
    resetRef(ItemStores.photoBlob),
    setRef(ItemStores.performSave, (name, photoId) =>
      addSop(() => performCreateItem(name, photoId))
    ),
  ]);

const findBatchesOfItem = (itemId) =>
  free
    .of(itemId) //
    .map(makeGetBatchesAllDocOption)
    .chain(database.alldocs);

const deleteSingleDoc = (docId) =>
  free.of(docId)
    .chain(database.get)
    .map(R.set(ItemL.deleted, true))
    .chain(database.put);

const markDelectedDocs = (docs) =>
  R.map(
    R.set(ItemL.deleted, true)
  )(docs);

const performDeleteItem = (itemId) =>
  free.parallel([
    deleteSingleDoc(itemId),
    findBatchesOfItem(itemId)
      .map(markDelectedDocs)
      .chain(database.bulkDocs)
  ])
    .chain(goToHome);

const performEditPhoto = (itemId, blob) =>
  free
    .of(itemId) //
    .chain(database.get)
    .chain((doc) => database.attach(doc, `image`, blob))
    .chain((_) => goToItem(itemId));

const performEditName = (itemId, name) =>
  free
    .of(itemId) //
    .chain(database.get)
    .map(R.set(ItemL.name, name))
    .chain(database.put)
    .map(R.view(ItemL.name))
    .chain(setRef(ItemStores.name));

const performEditRemindDays = (itemId, days) =>
  free.of(itemId) //
    .chain(database.get)
    .map(R.set(ItemL.remindDays, days))
    .chain(database.put)
    .map(R.view(ItemL.remindDays))
    .chain(setRef(ItemStores.remindDays));
//TODO: change all batches too


const presentRemind = (itemId) =>
  free.of(itemId) //
    .chain(database.get)
    .map(R.view(ItemL.remindDays))
    .chain(setRef(ItemStores.remindDays));

const performAddBatch = (itemId, expiryDate, count) => {
  return free
    .of(makeBatchDoc(itemId, expiryDate)) //
    .map(addBatch(count))
    .chain(database.put)
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
    .chain(database.get)
    .map(addBatch(value))
    .chain(database.put)
    .chain((_) => presentBatches(itemId));

const makeBatchAdd = (itemId, value, batches) =>
  R.map(
    (batch) => () =>
      addSop(() => performBatchCounting(itemId, batch._id, value))
  )(batches);

const presentBatches = (itemId) =>
  findBatchesOfItem(itemId)
    .chain((batches) =>
      free.sequence([
        setRef(BatchStores.batches, batches),
        setRef(BatchStores.performBatchInc, makeBatchAdd(itemId, 1, batches)),
        setRef(BatchStores.performBatchDec, makeBatchAdd(itemId, -1, batches)),
        setRef(BatchStores.performDeleteBatch, makeDeleteBatch(itemId, batches)),
      ])
    );

const performAddNewTag = (itemId, tag) =>
  free
    .of(itemId) //
    .chain(database.get)
    .map(addTag(tag))
    .chain(database.put)
    .map(R.view(ItemL.id))
    .chain(presentTags);

const performRemoveTag = (itemId, tag) =>
  free
    .of(itemId) //
    .chain(database.get)
    .map(removeTag(tag))
    .chain(database.put)
    .map(R.view(ItemL.id))
    .chain(presentTags);

const presentTagSelections = (itemId, selectedTags) =>
  getAllTags()
    .chain((tags) =>
      free.sequence([
        setRef(TagStores.tags, selectedTags),
        setRef(TagStores.allTags, tags),
        setRef(TagStores.allTagsSelected, R.map((tag) => R.includes(tag, selectedTags), tags)),

        setRef(
          TagStores.performToggleTagFilter,
          R.map(
            (tag) =>
              R.ifElse(
                R.flip(R.includes)(selectedTags),
                (tag) => () => addSop(() => performRemoveTag(itemId, tag)),
                (tag) => () => addSop(() => performAddNewTag(itemId, tag)),
              )(tag),
            tags
          )
        ),
      ])
    );

const presentTags = (itemId) =>
  free
    .of(itemId) //
    .chain(database.get)
    .map(R.view(ItemL.tags))
    .map(R.defaultTo([]))
    .chain((tags) => presentTagSelections(itemId, tags));

const presentItem = (itemId) =>
  free
    .of(itemId) //
    .chain(database.getWithAttachment)
    .map(docToItemWithBlob)
    .chain((itemWithBlob) =>
      free.sequence([
        setRef(ItemStores.name, itemWithBlob.name),
        setRef(ItemStores.photoBlob, itemWithBlob.blob),
      ])
    );

const goToItem = (itemId) =>
  free.sequence([
    viewMainPage(Item),
    setItemUrl(itemId),
    setRef(ItemStores.nameError, null),
    setRef(ItemStores.performEditName, (newName) =>
      addSop(() => performEditName(itemId, newName))
    ),
    setRef(ItemStores.performEditRemindDays, (newDays) =>
      addSop(() => performEditRemindDays(itemId, newDays))
    ),
    setRef(BatchStores.performAddBatch, (expiryDate, count) =>
      addSop(() => performAddBatch(itemId, expiryDate, count))
    ),
    setRef(TagStores.performAddNewTag, (tag) =>
      addSop(() => performAddNewTag(itemId, tag))
    ),
    setRef(ItemStores.performEditPhoto, (blob) =>
      addSop(() => performEditPhoto(itemId, blob))
    ),
    setRef(ItemStores.performDeleteItem, () =>
      addSop(() => performDeleteItem(itemId))
    ),
    presentItem(itemId),
    presentRemind(itemId),
    presentTags(itemId),
    presentBatches(itemId),
  ]);

export { goToItem, goToItemCreation };
