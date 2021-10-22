import * as R from 'ramda';
import { cleanUp, destroy } from '../database';

import * as free from '../free_monad';
import { setRef } from '../ref';
import { setSettingUrl } from '../router';
import { addSop } from '../sop';
import { reload } from '../utils';
import { goToHome } from '../view/home';
import { viewMainPage } from '../view/view_store';
import { sync } from './backup';

import Setting, * as settingStore from './Setting.svelte';

const performDestroyStorage = () => destroy().chain((_) => reload());
const performCompactStorage = () => cleanUp();
const performSyncStorage = (backupCode) =>
  free.sequence([
    setRef(settingStore.syncStatus, 'Syncing...'),
    sync(backupCode).call(free.bichain(
      (error) => setRef(settingStore.syncStatus, `Sync Error: ${error}`),
      (_) => setRef(settingStore.syncStatus, `Sync is done!`),
    ))
  ])

const goToSettingPage = () =>
  free.sequence([
    viewMainPage(Setting),
    setSettingUrl(),
    setRef(settingStore.performCleanupStorage, () =>
      addSop(() => performCompactStorage())
    ),
    setRef(settingStore.performDestroyStorage, () =>
      addSop(() => performDestroyStorage())
    ),
    setRef(settingStore.performSyncStorage, (code) =>
      addSop(() => performSyncStorage(code))
    ),
    setRef(settingStore.backFromSettingPage, () => addSop(() => goToHome())),
  ]);

export { goToSettingPage };
