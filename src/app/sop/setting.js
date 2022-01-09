import * as R from 'ramda';
import { cleanUp, destroy } from '../database';

import * as free from 'fp/free';
import { setRef } from 'fp/ref';
import { addSop } from 'fp/sop';
import { viewMainPage } from 'fp/view';

import Setting from 'view/setting/Setting.svelte';
import { SettingStores } from 'app/stores';

import { setSettingUrl } from '../router';
import { reload } from '../utils';
import { goToHome } from './home';
import { sync } from './backup';
import * as kv from 'app/kv';

const performDestroyStorage = () =>
  free.sequence([
    kv.remove('filteringTags'),
    kv.remove('hasExpiringFla'),
    kv.remove('version'),
    destroy(),
    reload()
  ]);

const performCompactStorage = () =>
  cleanUp()

const performSyncStorage = (backupCode) =>
  free.sequence([
    setRef(SettingStores.syncStatus, 'Syncing...'),
    sync(backupCode).call(free.bichain(
      (error) => setRef(SettingStores.syncStatus, `Sync Error: ${error}`),
      (_) => setRef(SettingStores.syncStatus, `Sync is done!`),
    ))
  ])

const goToSettingPage = () =>
  free.sequence([
    viewMainPage(Setting),
    setSettingUrl(),
    setRef(SettingStores.performCleanupStorage, () =>
      addSop(() => performCompactStorage())
    ),
    setRef(SettingStores.performDestroyStorage, () =>
      addSop(() => performDestroyStorage())
    ),
    setRef(SettingStores.performSyncStorage, (code) =>
      addSop(() => performSyncStorage(code))
    ),
    setRef(SettingStores.backFromSettingPage, () => addSop(() => goToHome())),
  ]);

export { goToSettingPage };
