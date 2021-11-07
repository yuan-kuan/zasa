import * as R from 'ramda';

import * as free from 'fp/free';
import { addSop } from 'fp/sop';
import { resetRef, setRef } from 'fp/ref';
import { viewMainPage } from 'fp/view';

import Item from 'view/item/Item.svelte';
import ItemCreation from 'view/item/ItemCreation.svelte';

import { setItemCreationUrl, setItemUrl } from '../router';
import { ItemStores, BatchStores, TagStores } from '../stores';
import * as database from '../database';
import {
  L as ItemL,
  addTag,
  removeTag,
} from './item_utils';
import { getAllTags } from './filter';
import { goToHome } from './home';
import * as item_ops from './item_ops';
import * as batch_ops from './batch_ops';

const performCreateItem = (name, blob) =>
  item_ops.create(name, blob)
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

const performDeleteItem = (itemId) =>
  free.sequence([
    item_ops.remove(itemId),
    goToHome
  ]);

const performEditPhoto = (itemId, blob) =>
  free.sequence([
    item_ops.editPhoto(itemId, blob),
    goToItem(itemId)
  ]);

const performEditName = (itemId, name) =>
  item_ops.editName(itemId, name).chain(setRef(ItemStores.name));

const performEditRemindDays = (itemId, days) =>
  item_ops.editRemindDays(itemId, days)
    .map(R.view(ItemL.remindDays))
    .chain(setRef(ItemStores.remindDays));

const presentRemind = (itemId) =>
  free.of(itemId) //
    .chain(database.get)
    .map(R.view(ItemL.remindDays))
    .chain(setRef(ItemStores.remindDays));

const performCreateBatch = (itemId, expiryDate) =>
  free.sequence([
    batch_ops.create(itemId, expiryDate),
    presentBatches(itemId)
  ]);

const performDeleteBatch = (itemId, batchId) =>
  free.sequence([
    batch_ops.remove(batchId),
    presentBatches(itemId)
  ]);

const makeDeleteBatch = (itemId, batches) =>
  R.map((batch) => () => addSop(() => performDeleteBatch(itemId, batch._id)))(
    batches
  );

const performBatchCounting = (itemId, batches, operation) =>
  R.map(
    (batch) => () =>
      addSop(() => free.sequence([
        operation(batch),
        presentBatches(itemId)
      ]))
  )(batches);

const presentBatches = (itemId) =>
  batch_ops.getAll(itemId)
    .chain((batches) =>
      free.sequence([
        setRef(BatchStores.batches, batches),
        setRef(BatchStores.performBatchInc, performBatchCounting(itemId, batches, batch_ops.incAndSaveCount)),
        setRef(BatchStores.performBatchDec, performBatchCounting(itemId, batches, batch_ops.decAndSaveCount)),
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
  item_ops.getItemWithPhoto(itemId).chain((itemWithBlob) =>
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
      addSop(() => performCreateBatch(itemId, expiryDate, count))
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
