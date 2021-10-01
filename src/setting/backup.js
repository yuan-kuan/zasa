import * as R from 'ramda';
import daggy from 'daggy';
import * as free from '../free_monad';
import { registerStaticInterpretor } from '../sop';
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

let isRemoteBackup = REMOTE_BACKUP_CRED_URL != undefined;
let isLocalBackup = LOCAL_DB_URL != undefined;

if (!isRemoteBackup && !isLocalBackup) {
  console.warn('Backup is not setup properly');
} else {
  registerStaticInterpretor([Backup,
    isRemoteBackup ? remoteBackupToFuture : localBackupToFuture]);
}

const sync = (code) => free.lift(Sync(code));

export { sync };
