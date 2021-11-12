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

const presentItems = (items) => free.sequence([
  setRef(GridStores.items, items),
  presentGoToItems(items),
]);

const presentAllItems = (_) =>
  item_ops.getAll()
    .chain(presentItems);

const presentFilteredItem = (filterTags) =>
  free
    .of(filterTags)
    .chain(filter_ops.getItemsWithTags)
    .chain((items) =>
      free.sequence([setRef(GridStores.items, items), presentGoToItems(items)])
    );

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

const presentItemsChangeThis = (savedTags) =>
  free.of(savedTags).chain(
    R.ifElse(R.isEmpty, presentAllItems, presentFilteredItem))

const presentExpiringItems = () =>
  filter_ops.getExpiringItems().chain(presentItems);

const presentExpiringItemsWithTags = (tags) => {
  console.log('tags :>> ', tags);
  return filter_ops.getExpiringItemsWithTags(tags).chain(presentItems);
};

const performToggleExpiringFilter = (v) =>
  free.sequence([
    filter_ops.setExpiringFlag(v),
    presentGrid()
  ]);

const presentExpiringFilter = (itsOn) =>
  free.sequence([
    filter_ops.getExpiringItemCount().chain(setRef(FilterStores.expiringItemCount)),
    setRef(FilterStores.expiringFilterSelected, itsOn),
    setRef(FilterStores.performToggleExpiringFilter, () => addSop(() => performToggleExpiringFilter(!itsOn))),
  ]);

const presentGrid = () =>
  filter_ops.hasExpiringFlag()
    .call(free.bichain(
      (no) =>
        free.sequence([
          presentExpiringFilter(no),
          filter_ops.getSavedTagFilter()
            .call(free.bichain(
              free.parallelConverge([
                presentTagSelection,
                presentAllItems
              ]),
              free.parallelConverge([
                presentTagSelection,
                presentFilteredItem
              ])
            ))
        ]),
      (yes) =>
        free.sequence([
          presentExpiringFilter(yes),
          filter_ops.getSavedTagFilter()
            .call(free.bichain(
              () => free.parallel([
                presentTagSelection([]),
                presentExpiringItems()
              ]),
              free.parallelConverge([
                presentTagSelection,
                presentExpiringItemsWithTags
              ])
            ))
        ])
    ));

export { presentGrid, setup as gridSetup };
