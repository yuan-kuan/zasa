import * as R from 'ramda';

import * as free from 'fp/free';
import { setRef } from 'fp/ref';
import { addSop } from 'fp/sop';

import { FilterStores, GridStores } from 'app/stores';
import { goToItem } from './item';

import * as item_ops from './item_ops';
import * as filter_ops from './filter_ops';
import { tapLog } from '../utils';

const setup = () => filter_ops.setup();

const presentGoToItems = (itemWithBlobs) =>
  free
    .of(itemWithBlobs) //
    .map(R.map((ivb) => () => addSop(() => goToItem(ivb.itemId))))
    .chain(setRef(GridStores.goToItem));

const presentAllItems = (_) =>
  item_ops.getAll()
    .chain((items) =>
      free.sequence([
        setRef(GridStores.items, items),
        presentGoToItems(items),
      ])
    );

const presentFilteredItem = (filterTags) =>
  free
    .of(filterTags)
    .chain(filter_ops.getItemsWithTags)
    .chain((items) =>
      free.sequence([setRef(GridStores.items, items), presentGoToItems(items)])
    );

const presentExpiringItems = (_) => filter_ops.getItemsExpiringBefore((new Date(2023, 0)).valueOf());

const performAddTagFilter = (tag) =>
  free.sequence([filter_ops.updateSavedTagFilter(R.append(tag)), presentGrid()]);


const performRemoveTagFilter = (tag) =>
  free.sequence([
    filter_ops.updateSavedTagFilter(R.without([tag])),
    presentGrid(),
  ]);

const presentTagSelection = (selectedTags) =>
  filter_ops.getAllTags()
    .chain((tags) =>
      free.sequence([
        setRef(FilterStores.tags, selectedTags),
        setRef(FilterStores.allTags, tags),
        setRef(FilterStores.allTagsSelected, R.map((tag) => R.includes(tag, selectedTags), tags)),

        setRef(
          FilterStores.performToggleTagFilter,
          R.map(
            (tag) =>
              R.ifElse(
                R.flip(R.includes)(selectedTags),
                (tag) => () => addSop(() => performRemoveTagFilter(tag)),
                (tag) => () => addSop(() => performAddTagFilter(tag)),
              )(tag),
            tags
          )
        ),
      ])
    );

const presentItems = (savedTags) =>
  free.of(savedTags).chain(
    R.ifElse(R.isEmpty, presentAllItems, presentFilteredItem))
// R.ifElse(R.isEmpty, presentExpiringItems, presentFilteredItem))

const presentGrid = () =>
  filter_ops.getSavedTagFilter().chain(free.parallelConverge([
    presentTagSelection,
    presentItems
  ]));

export { presentGrid, setup as gridSetup };
