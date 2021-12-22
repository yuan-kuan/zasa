import daggy from 'daggy';

import * as free from 'fp/free';

import { fetchJson, tapLog } from '../utils';
import { syncWithBackUp } from '../db_ops';

const Backup = daggy.taggedSum('Backup', {
  Sync: ['code']
});
const { Sync } = Backup;

const remoteSyncWithCode = (code) =>
  free.of(code)//
    .map((code) => `${REMOTE_BACKUP_CRED_URL}/${code}`)
    .chain((requestUrl) => fetchJson(requestUrl, { method: 'GET' }))
    .chain((creds) => syncWithBackUp(creds.dbUrl, creds.username, creds.password));

const remoteBackupToFuture = (p) => p.cata({
  Sync: (code) => free.interpete(remoteSyncWithCode(code)),
});

const localBackupToFuture = (p) => p.cata({
  Sync: (code) => free.interpete(syncWithBackUp(`${LOCAL_DB_URL}/${code}`, LOCAL_DB_USERNAME, LOCAL_DB_PASSWORD)),
});

const emptyBackupToFuture = (p) => p.cata({
  Sync: (_) => free.of(null),
});

const setupBackupInterpretor = () => {
  // Read the ENV variables
  let isRemoteBackup = REMOTE_BACKUP_CRED_URL != undefined;
  let isLocalBackup = LOCAL_DB_URL != undefined;

  console.log(`REMOTE_BACKUP_CRED_URL ${REMOTE_BACKUP_CRED_URL}`);
  console.log(`LOCAL_DB_URL ${LOCAL_DB_URL}`);
  console.log(`isRemoteBackup ${isRemoteBackup}`);
  console.log(`isLocalBackup ${isLocalBackup}`);
  if (!isRemoteBackup && !isLocalBackup) {
    console.warn('Backup is not setup properly');
    return [Backup, emptyBackupToFuture];
  } else {
    return [Backup,
      isRemoteBackup ? remoteBackupToFuture : localBackupToFuture];
  }
}

const sync = (code) => free.lift(Sync(code));

export { setupBackupInterpretor, sync };
