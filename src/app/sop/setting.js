import * as R from 'ramda';
import { cleanUp, destroy } from '../database';

import * as free from 'fp/free';
import { setRef } from 'fp/ref';
import { addSop } from 'fp/sop';
import { viewMainPage } from 'fp/view';

import Setting from 'view/setting/Setting.svelte';
import { SettingStores, SyncStores } from 'app/stores';

import { setSettingUrl } from '../router';
import { reload, tapLog } from '../utils';
import { goToHome } from './home';
import * as backup from './backup';
import * as kv from 'app/kv';

const performDestroyStorage = () =>
  free.sequence([
    kv.remove('filteringTags'),
    kv.remove('hasExpiringFla'),
    kv.remove('version'),
    kv.remove('backupCode'),
    kv.remove('backupTimestamp'),
    destroy(),
    reload()
  ]);

const performCompactStorage = () =>
  cleanUp()

const performSyncStorage = (backupCode) =>
  free.sequence([
    setRef(SyncStores.syncStatus, SyncStores.SYNCING),
    free.of(backupCode)
      .chain(backup.sync)
      .call(free.bichain(
        (error) => free.sequence([
          setRef(SyncStores.syncStatus, SyncStores.FAILED),
          setRef(SyncStores.syncErrorMessage, error)
        ]),
        (_) => free.sequence([
          setRef(SyncStores.syncStatus, SyncStores.DONE),
          backup.saveCode(backupCode, new Date()),
          // presentSync()
        ])
      )
      )
  ])


const presentSync = () =>
  free.sequence([
    setRef(SyncStores.syncStatus, SyncStores.IDLE),
    free.bichain(
      () => setRef(SyncStores.savedCode, ''),
      setRef(SyncStores.savedCode),
      backup.getSavedCode(),
    ),
    free.bichain(
      () => setRef(SyncStores.savedTimestamp, ''),
      setRef(SyncStores.savedTimestamp),
      backup.getSavedTimestamp(),
    ),
    setRef(SyncStores.performSyncStorage, (code) =>
      addSop(() => performSyncStorage(code))
    ),
  ]);

const goToSettingPage = () =>
  free.sequence([
    viewMainPage(Setting),
    setSettingUrl(),
    presentSync(),
    setRef(SettingStores.performCleanupStorage, () =>
      addSop(() => performCompactStorage())
    ),
    setRef(SettingStores.performDestroyStorage, () =>
      addSop(() => performDestroyStorage())
    ),
    setRef(SettingStores.backFromSettingPage, () => addSop(() => goToHome())),
  ]);

export { goToSettingPage };
