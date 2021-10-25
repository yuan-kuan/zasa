import { createRef } from './ref';

export const Nav = {
  goToCreateItem: createRef(),
  goToSetting: createRef()
}

export const FilterStores = {
  tags: createRef([]),
  allTags: createRef([]),
  allTagsSelected: createRef([]),
  performToggleTagFilter: createRef([]),
}

export const BatchStores = {
  batches: createRef([]),
  performAddBatch: createRef(),
  performBatchInc: createRef([]),
  performBatchDec: createRef([]),
  performDeleteBatch: createRef([]),
}