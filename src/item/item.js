import * as R from 'ramda';

import * as free from '../free_monad';
import { addSop } from '../sop';
import { resetRef, setRef } from '../ref';
import { setItemCreationUrl, setItemUrl } from '../router';
import { viewMainPage } from '../view/view_store';

import Item, * as itemStore from './Item.svelte';
import ItemCreation from './ItemCreation.svelte';
import { BatchStores, TagStores } from '../stores';
import * as itemCreationStore from './ItemCreation.svelte';
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
import { goToHome } from '../view/home';

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
    resetRef(itemStore.photoBlob),
    setRef(itemCreationStore.backFromItemPage, () => addSop(() => goToHome())),
    setRef(itemCreationStore.performSave, (name, photoId) =>
      addSop(() => performCreateItem(name, photoId))
    ),
  ]);

const performEditPhoto = (itemId, blob) =>
  free
    .of(itemId) //
    .map(tapLog(`blob is ${blob}`))
    .chain(get)
    .map(tapLog('item doc before attach'))
    .chain((doc) => attach(doc, `image`, blob))
    .map(tapLog('attached'))
    .chain((_) => goToItem(itemId));

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
        setRef(BatchStores.batches, batches),
        setRef(BatchStores.performBatchInc, makeBatchAdd(itemId, 1, batches)),
        setRef(BatchStores.performBatchDec, makeBatchAdd(itemId, -1, batches)),
        setRef(BatchStores.performDeleteBatch, makeDeleteBatch(itemId, batches)),
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

const presentItemTags = (itemDoc) =>
  free
    .of(itemDoc) //
    .map(R.view(ItemL.tags))
    .map(R.defaultTo([]))
    .chain((tags) =>
      free.sequence([
        // setRef(tagStore.tags, tags),
        // setRef(
        //   tagStore.performRemoveTag,
        //   R.map(
        //     (tag) => () =>
        //       addSop(() => performRemoveTag(R.view(ItemL.id, itemDoc), tag))
        //   )(tags)
        // ),
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
    setRef(BatchStores.performAddBatch, (expiryDate, count) =>
      addSop(() => performAddBatch(itemId, expiryDate, count))
    ),
    setRef(TagStores.performAddNewTag, (tag) =>
      addSop(() => performAddNewTag(itemId, tag))
    ),
    setRef(itemStore.performEditPhoto, (blob) =>
      addSop(() => performEditPhoto(itemId, blob))
    ),
    setRef(itemStore.backFromItemPage, () => addSop(() => goToHome())),
    presentItem(itemId),
    presentBatches(itemId),
    presentTags(itemId),
  ]);

export { goToItem, goToItemCreation };
