import { createRef } from '../ref';

export const categoryName = createRef('Not Defined');
export const items = createRef([]);
export const goToItem = createRef([]);
export const goToCreateItem = createRef(() => console.log('create item now!'));
