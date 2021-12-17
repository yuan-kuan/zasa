import * as R from 'ramda';
import * as kv from '../kv';

const save = (version) => kv.set('version', version);

const checkNewUser = (_) => kv.get(null, 'version').map(R.isNil);

const checkSameVersion = (version) => kv.get(null, 'version').map(R.equals(version));

const checkNewerVersion = (version) =>
  checkSameVersion(version).map(R.not);

export { save, checkNewUser, checkNewerVersion, checkSameVersion };
