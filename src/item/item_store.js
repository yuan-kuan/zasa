import { createRef } from '../ref';

export const isCreation = createRef(false);
export const name = createRef('Not an Item');
export const photoBlob = createRef();
export const performSave = createRef(() => console.log('save item now!'));
