import * as R from 'ramda';
import * as free from 'fp/free';

import * as filter_ops from './filter_ops';
import * as tag_ops from "./tag_ops";

const renameItemTag = (original, next) =>
  free.of(original)
    .map(R.of)
    // TODO: We do not need blob and name, just id
    .chain(filter_ops.getItemsWithTags)
    .map(R.pluck('itemId'))
    .chain((ids) =>
      free.sequence([
        R.traverse(free.of, (id) => tag_ops.remove(id, original), ids),
        R.traverse(free.of, (id) => tag_ops.add(id, next), ids)
      ]));

const renameSavedTagFilter = (original, next) =>
  filter_ops.getSavedTagFilter()
    .chain(
      R.ifElse(
        R.includes(original),
        (_) => free.sequence([
          filter_ops.removeFilterTag(original),
          filter_ops.addFilterTag(next),
        ]),
        free.of
      )
    );

const removeItemTag = (original) =>
  free.of(original)
    .map(R.of)
    // TODO: We do not need blob and name, just id
    .chain(filter_ops.getItemsWithTags)
    .map(R.pluck('itemId'))
    .chain((ids) =>
      free.sequence([
        R.traverse(free.of, (id) => tag_ops.remove(id, original), ids)
      ]));

const removeSavedTagFilter = (original) =>
  filter_ops.removeFilterTag(original);

const renameTag = R.curry((original, next) =>
  free.parallel([
    renameItemTag(original, next),
    renameSavedTagFilter(original, next),
  ]));

const removeTag = (original) =>
  free.parallel([
    removeItemTag(original),
    removeSavedTagFilter(original),
  ]);

export { renameTag, removeTag }