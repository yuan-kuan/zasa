import { createRef } from './ref';

export const Nav = {
  goToCreateItem: createRef(),
  goToSetting: createRef(),
  backToHome: createRef()
}

export const FilterStores = {
  tags: createRef([]),
  allTags: createRef([]),
  allTagsSelected: createRef([]),
  performToggleTagFilter: createRef([]),
}

export const TagStores = {
  allTags: createRef([]),
  allTagsSelected: createRef([]),
  performToggleTagFilter: createRef([]),
  tags: createRef([]),
  performAddNewTag: createRef(),
}

export const BatchStores = {
  batches: createRef([]),
  performAddBatch: createRef(),
  performBatchInc: createRef([]),
  performBatchDec: createRef([]),
  performDeleteBatch: createRef([]),
}