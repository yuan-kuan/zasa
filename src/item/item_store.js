import { createRef } from '../ref';

export const name = createRef();
export const nameError = createRef();
export const photoBlob = createRef();
export const editingPhotoBlob = createRef();
export const batches = createRef([]);
export const tags = createRef([]);
export const tagSelections = createRef([]);
export const performSave = createRef();
export const performEditName = createRef();
export const performAddBatch = createRef();
export const performBatchInc = createRef([]);
export const performBatchDec = createRef([]);
export const performDeleteBatch = createRef([]);
export const performAddNewTag = createRef();
export const performAddTag = createRef([]);
export const performRemoveTag = createRef([]);
export const goToEditPhoto = createRef();
