import * as R from 'ramda';
import * as free from 'fp/free';
import { get, put } from 'app/database';

const L = {
  tags: R.lensProp('tags'),
};

const getItemTags = (itemId) =>
  free
    .of(itemId) //
    .chain(get)
    .map(R.view(L.tags))
    .map(R.defaultTo([]))

const appendTagAndSort = R.curry((tag, tags) =>
  R.pipe(R.defaultTo([]), R.append(tag), R.sortBy(R.toLower))(tags)
);

const addTag = R.curry((tag, itemDoc) =>
  R.over(L.tags, appendTagAndSort(tag), itemDoc)
);

const removeTag = R.curry((tag, itemDoc) =>
  R.over(L.tags, R.without([tag]), itemDoc)
);

const add = (itemId, tag) =>
  free
    .of(itemId) //
    .chain(get)
    .map(addTag(tag))
    .chain(put)

const remove = (itemId, tag) =>
  free
    .of(itemId) //
    .chain(get)
    .map(removeTag(tag))
    .chain(put)

export { getItemTags, add, remove }