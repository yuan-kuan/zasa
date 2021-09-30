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

const syncWithCode = (code) =>
  free.of(code)//
    .map((code) => `${REMOTE_BACKUP_CRED_URL}/${code}`)
    .chain((requestUrl) => fetchJson(requestUrl, { method: 'GET' }))
    .call(free.bichain(
      (error) => free.of(error).map(tapLog('rejected')),
      (creds) => syncWithBackUp(creds.dbUrl, creds.username, creds.password)
    ))

const backupToFuture = (p) => p.cata({
  Sync: (code) => free.interpete(syncWithCode(code)),
});

registerStaticInterpretor([Backup, backupToFuture]);

const sync = (code) => free.lift(Sync(code));

export { sync };
