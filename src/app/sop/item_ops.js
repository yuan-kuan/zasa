import * as free from 'fp/free';
import { attach, getWithAttachment, put } from 'app/database';
import { randomFourCharacter } from 'app/utils';
import { docToItemWithBlob, makeItemDoc } from './item_utils';

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

const getItemWithPhoto = (itemId) =>
  free
    .of(itemId) //
    .chain(getWithAttachment)
    .map(docToItemWithBlob);


export { create, getItemWithPhoto };