import { createRef } from '../ref';

export const items = createRef([]);
export const goToItem = createRef([]);
export const goToCreateItem = createRef(() => console.log('create item now!'));

export const filteringTags = createRef([]);
export const tagSelections = createRef([]);
export const performAddTagToFilter = createRef([]);
export const performRemoveTagFromFilter = createRef([]);

export const goToSetting = createRef();
