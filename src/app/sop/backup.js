import daggy from 'daggy';
import * as R from 'ramda';
import * as free from 'fp/free';

import * as kv from '../kv';
import { fetchJson, tapLog } from '../utils';
import { syncWithBackUp } from '../db_ops';

const Backup = daggy.taggedSum('Backup', {
  Sync: ['code'],
});
// @ts-ignore
const { Sync } = Backup;

const remoteSyncWithCode = (code) =>
  free.of(code)//
    // @ts-ignore replacable ENV
    .map((code) => `${REMOTE_BACKUP_CRED_URL}/${code}`)
    .chain((requestUrl) => fetchJson(requestUrl, { method: 'GET' }))
    .chain((creds) => syncWithBackUp(creds.dbUrl, creds.username, creds.password));

const remoteBackupToFuture = (p) => p.cata({
  Sync: (code) => free.interpete(remoteSyncWithCode(code)),
});

const localBackupToFuture = (p) => p.cata({
  // @ts-ignore replacable ENV
  Sync: (code) => free.interpete(syncWithBackUp(`${LOCAL_DB_URL}/${code}`, LOCAL_DB_USERNAME, LOCAL_DB_PASSWORD)),
});

const emptyBackupToFuture = (p) => p.cata({
  Sync: (_) => free.of(null),
});

const setupBackupInterpretor = () => {
  // Read the ENV variables
  // @ts-ignore replacable ENV
  let isRemoteBackup = REMOTE_BACKUP_CRED_URL != undefined;
  // @ts-ignore replacable ENV
  let isLocalBackup = LOCAL_DB_URL != undefined;
  if (!isRemoteBackup && !isLocalBackup) {
    console.warn('Backup is not setup properly');
    return [Backup, emptyBackupToFuture];
  } else {
    return [Backup,
      isRemoteBackup ? remoteBackupToFuture : localBackupToFuture];
  }
}

const sync = (code) => free.lift(Sync(code));
const saveCode = (code, timeStamp) =>
  free.sequence([
    kv.set('backupCode', code),
    kv.set('backupTimestamp', timeStamp),
  ])
const getSavedCode = () =>
  kv.get('', 'backupCode')
    .chain(
      R.ifElse(
        R.isEmpty,
        free.left,
        free.right,
      ));

const getSavedTimestamp = () =>
  kv.get('', 'backupTimestamp')
    .chain(
      R.ifElse(
        R.isEmpty,
        free.left,
        (dateString) => free.right(new Date(dateString)),
      ));

export { setupBackupInterpretor, sync, saveCode, getSavedCode, getSavedTimestamp };
