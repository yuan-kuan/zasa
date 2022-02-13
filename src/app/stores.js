import { createRef } from 'fp/ref';

/**
 * @typedef {object} Nav
 * @property {object} goToCreateItem
 * @property {object} goToSetting
 * @property {object} goToInfo
 * @property {object} goToHowTo
 * @property {object} goToRelease
 * @property {object} backToHome
*/

/**
 * @type Nav
 */
export const Nav = {
  goToCreateItem: createRef(),
  goToSetting: createRef(),
  goToInfo: createRef(),
  goToHowTo: createRef(),
  goToRelease: createRef(),
  backToHome: createRef()
}

/**
 * @typedef {object} GridStores
 * @property {object} items
 * @property {object} goToItem
*/

/**
 * @type GridStores
 */
export const GridStores = {
  items: createRef([]),
  goToItem: createRef([])
}

/**
 * @typedef {object} FilterStores
 * @property {object} tags
 * @property {object} allTags
 * @property {object} allTagsSelected
 * @property {object} performToggleTagFilter
 * @property {object} performClearFilter
 * @property {object} expiringItemCount
 * @property {object} expiringFilterSelected
 * @property {object} performToggleExpiringFilter
*/

/**
 * @type FilterStores
 */
export const FilterStores = {
  tags: createRef([]),
  allTags: createRef([]),
  allTagsSelected: createRef([]),
  performToggleTagFilter: createRef([]),
  performClearFilter: createRef(),
  expiringItemCount: createRef(),
  expiringFilterSelected: createRef(),
  performToggleExpiringFilter: createRef(),
}

/**
 * @typedef {object} ItemStores
 * @property {object} name
 * @property {object} nameError
 * @property {object} photoBlob
 * @property {object} editingPhotoBlob
 * @property {object} remindDays 
 * @property {object} note
 * @property {object} savedStatus
 * @property {object} performEditName
 * @property {object} performEditPhoto
 * @property {object} performDeleteItem
 * @property {object} backFromEditPhoto
 * @property {object} performSave
 * @property {object} performEditRemindDays
 * @property {object} performEditNote
*/

/**
 * @type ItemStores
 */
export const ItemStores = {
  name: createRef(),
  nameError: createRef(),
  photoBlob: createRef(),
  editingPhotoBlob: createRef(),
  remindDays: createRef(),
  note: createRef(),
  savedStatus: createRef(),
  performEditName: createRef(),
  performEditPhoto: createRef(),
  performDeleteItem: createRef(),
  backFromEditPhoto: createRef(),
  performSave: createRef(),
  performEditRemindDays: createRef(),
  performEditNote: createRef(),
}

/**
 * @typedef {object} TagStores 
 * @property {object}  allTags
 * @property {object}  allTagsSelected
 * @property {object}  performToggleTagFilter
 * @property {object}  tags
 * @property {object}  performAddNewTag
 * @property {object}  performRenameTag
 * @property {object}  performRemoveTag
*/

/**
 * @type TagStores
 */
export const TagStores = {
  allTags: createRef([]),
  allTagsSelected: createRef([]),
  performToggleTagFilter: createRef([]),
  tags: createRef([]),
  performAddNewTag: createRef(),
  performRenameTag: createRef([]),
  performRemoveTag: createRef([]),
}

/**
 * @typedef {object} BatchStores 
 * @property {object}  batches
 * @property {object}  performAddBatch
 * @property {object}  performBatchInc
 * @property {object}  performBatchDec
 * @property {object}  performBatchUpdate
 * @property {object}  performDeleteBatch
*/

/**
 * @type BatchStores
 */
export const BatchStores = {
  batches: createRef([]),
  performAddBatch: createRef(),
  performBatchInc: createRef([]),
  performBatchDec: createRef([]),
  performBatchUpdate: createRef([]),
  performDeleteBatch: createRef([]),
}

/**
 * @typedef {object} SettingStores
 * @property {object}  spaceTaken 
 * @property {object}  spaceLeft
 * @property {object}  performCleanupStorage
 * @property {object}  performDestroyStorage
 * @property {object}  backFromSettingPage 
*/

/**
 * @type SettingStores
 */
export const SettingStores = {
  spaceTaken: createRef(),
  spaceLeft: createRef(),
  performCleanupStorage: createRef(),
  performDestroyStorage: createRef(),
  backFromSettingPage: createRef(),
}

/**
 * @typedef {object} SyncStores
 * @property {object} savedCode - previously sync code that saved locally
 * @property {object} savedTimestamp
 * @property {object} syncStatus
 * @property {object} syncErrorMessage
 * @property {object} performSyncStorage
 * @property {Symbol} IDLE
 * @property {Symbol} SYNCING
 * @property {Symbol} DONE
 * @property {Symbol} FAILED
 */

/**
 * @type SyncStores
 */
export const SyncStores = {
  savedCode: createRef(),
  savedTimestamp: createRef(),
  syncStatus: createRef(),
  syncErrorMessage: createRef(),
  performSyncStorage: createRef(),

  IDLE: Symbol('sync_status_idle'),
  SYNCING: Symbol('sync_status_syncing'),
  DONE: Symbol('sync_status_done'),
  FAILED: Symbol('sync_status_failed'),
}

