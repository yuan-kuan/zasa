import { createRef } from '../ref';

export const name = createRef('Not an Item');
export const performSave = createRef(() => console.log('save item now!'));
