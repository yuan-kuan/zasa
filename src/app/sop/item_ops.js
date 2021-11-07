import * as R from 'ramda';
import * as free from 'fp/free';
import { attach, getWithAttachment, get, put } from 'app/database';
import * as db_ops from 'app/db_ops';
import { randomFourCharacter } from 'app/utils';
import { L, docToItemWithBlob, makeItemDoc } from './item_utils';
import * as batch_ops from './batch_ops';

const create = (name, blob) =>
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

const remove = (itemId) =>
  free.parallel([
    db_ops.remove(itemId),
    batch_ops.removeAll(itemId)
  ])

const getItemWithPhoto = (itemId) =>
  free
    .of(itemId) //
    .chain(getWithAttachment)
    .map(docToItemWithBlob);

const editPhoto = (itemId, blob) =>
  free
    .of(itemId) //
    .chain(get)
    .chain((doc) => attach(doc, `image`, blob));

const editName = (itemId, name) =>
  free
    .of(itemId) //
    .chain(get)
    .map(R.set(L.name, name))
    .chain(put)
    .map(R.view(L.name))

const editRemindDays = (itemId, days) => free
  .of(itemId) //
  .chain(get)
  .map(R.set(L.remindDays, days))
  .chain(put)
  .chain((_) => batch_ops.updateAllRemind(itemId))

export { create, remove, getItemWithPhoto, editPhoto, editName, editRemindDays };