import * as R from 'ramda';
import { cleanUp, destroy } from '../database';

import * as free from 'fp/free_monad';
import { setRef } from 'fp/ref';
import { addSop } from 'fp/sop';
import { viewMainPage } from 'fp/view_store';

import Setting, * as settingStore from 'view/setting/Setting.svelte';

import { setSettingUrl } from '../router';
import { reload } from '../utils';
import { goToHome } from './home';
import { sync } from './backup';


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