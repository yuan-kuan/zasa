import * as R from 'ramda';
import * as free from 'fp/free';
import { attach, getWithAttachment, get, put, alldocs } from 'app/database';
import * as db_ops from 'app/db_ops';
import { randomFourCharacter } from 'app/utils';
import { L, docToItemWithBlob, makeItemDoc } from './item_utils';
import * as batch_ops from './batch_ops';

const getAll = () =>
  free
    .of(db_ops.makeStartEndRangeAllDocOptionAttached('i_'))
    .chain(alldocs)
    .map(R.map(docToItemWithBlob))


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

const getItemRemindDays = (itemId) =>
  free.of(itemId)
    .chain(get)
    .map(R.view(L.remindDays))

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

const internalEditRemindDays = (itemId, days) =>
  free.of(itemId) //
    .chain(get)
    .map(R.set(L.remindDays, days))
    .chain(put)

const editRemindDays = (itemId, days) =>
  free.sequence([
    internalEditRemindDays(itemId, days),
    batch_ops.updateAllRemind(itemId)
  ])
    .map(R.view(L.remindDays));

export { getAll, create, remove, getItemWithPhoto, getItemRemindDays, editPhoto, editName, editRemindDays };