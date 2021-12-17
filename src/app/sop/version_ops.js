import * as R from 'ramda';
import * as kv from '../kv';

const save = (version) => kv.set('version', version);
const load = () => kv.get(null, 'version');

export { save, load };
