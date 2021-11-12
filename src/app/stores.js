import { createRef } from 'fp/ref';

export const Nav = {
  goToCreateItem: createRef(),
  goToSetting: createRef(),
  backToHome: createRef()
}

export const GridStores = {
  items: createRef([]),
  goToItem: createRef([])
}

export const FilterStores = {
  tags: createRef([]),
  allTags: createRef([]),
  allTagsSelected: createRef([]),
  performToggleTagFilter: createRef([]),

  expiringItemCount: createRef(),
  expiringFilterSelected: createRef(),
  performToggleExpiringFilter: createRef(),
}

export const ItemStores = {
  name: createRef(),
  nameError: createRef(),
  photoBlob: createRef(),
  editingPhotoBlob: createRef(),
  remindDays: createRef(),
  performEditName: createRef(),
  performEditPhoto: createRef(),
  performDeleteItem: createRef(),
  backFromEditPhoto: createRef(),
  performSave: createRef(),
  performEditRemindDays: createRef(),
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