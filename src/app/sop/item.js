import * as R from 'ramda';

import * as free from 'fp/free';
import { addSop } from 'fp/sop';
import { resetRef, setRef } from 'fp/ref';
import { viewMainPage } from 'fp/view';

import Item from 'view/item/Item.svelte';
import ItemCreation from 'view/item/ItemCreation.svelte';

import { setItemCreationUrl, setItemUrl } from '../router';
import { ItemStores, BatchStores, TagStores } from '../stores';
import { goToHome } from './home';

import * as batch_ops from './batch_ops';
import * as bulk_tag_ops from './bulk_tag_ops';
import * as filter_ops from './filter_ops';
import * as item_ops from './item_ops';
import * as tag_ops from './tag_ops';
import { tapLog } from 'app/utils';

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
    goToHome(itemId)
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
    .chain(setRef(ItemStores.remindDays));

const performEditNote = (itemId, note) =>
  item_ops.editNote(itemId, note)
    .chain(setRef(ItemStores.note));

const presentNote = (itemId) =>
  item_ops.getItemNote(itemId)
    .chain(setRef(ItemStores.note));

const presentRemind = (itemId) =>
  item_ops.getItemRemindDays(itemId)
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

const performBatchDirectUpdate = (itemId, batches) =>
  R.map(
    (batch) => (count) =>
      addSop(() => free.sequence([
        batch_ops.updateAndSaveCount(count, batch),
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
        setRef(BatchStores.performBatchUpdate, performBatchDirectUpdate(itemId, batches)),
        setRef(BatchStores.performDeleteBatch, makeDeleteBatch(itemId, batches)),
      ])
    );

const performAddNewTag = (itemId, tag) =>
  free.sequence([
    tag_ops.add(itemId, tag),
    presentTags(itemId)
  ]);

const performRemoveTag = (itemId, tag) =>
  free.sequence([
    tag_ops.remove(itemId, tag),
    presentTags(itemId)
  ]);

const performTagRenaming = (itemId, original, next) =>
  free.sequence([
    bulk_tag_ops.renameTag(original, next),
    presentTags(itemId)
  ]);

const performTagRemoving = (itemId, tag) =>
  free.sequence([
    bulk_tag_ops.removeTag(tag),
    presentTags(itemId)
  ]);

const presentTags = (itemId) =>
  free
    // Convert the two arguments to a list
    .of(R.curryN(2, R.unapply(R.identity)))
    .ap(filter_ops.getAllTags())
    .ap(tag_ops.getItemTags(itemId))
    .chain(([allTags, itemTags]) => free.sequence([
      setRef(TagStores.tags, itemTags),
      setRef(TagStores.allTags, allTags),
      setRef(TagStores.allTagsSelected, R.map((tag) => R.includes(tag, itemTags), allTags)),
      setRef(
        TagStores.performToggleTagFilter,
        R.map(
          (tag) => R.ifElse(
            R.flip(R.includes)(itemTags),
            (tag) => () => addSop(() => performRemoveTag(itemId, tag)),
            (tag) => () => addSop(() => performAddNewTag(itemId, tag))
          )(tag),
          allTags
        )
      ),
      setRef(TagStores.performRenameTag,
        R.map((tag) => (next) => addSop(() => performTagRenaming(itemId, tag, next)), allTags)
      ),
      setRef(TagStores.performRemoveTag,
        R.map((tag) => () => addSop(() => performTagRemoving(itemId, tag)), allTags)
      ),
    ]))

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
    setRef(ItemStores.performEditNote, (note) =>
      addSop(() => performEditNote(itemId, note))
    ),
    setRef(ItemStores.performDeleteItem, () =>
      addSop(() => performDeleteItem(itemId))
    ),
    presentItem(itemId),
    presentRemind(itemId),
    presentTags(itemId),
    presentBatches(itemId),
    presentNote(itemId),
  ]);

export { goToItem, goToItemCreation };
