import * as R from 'ramda';
import { cleanUp, destroy } from '../database';

import * as free from '../free_monad';
import { goToGrid } from '../grid/grid';
import { setRef } from '../ref';
import { setSettingUrl } from '../router';
import { addSop } from '../sop';
import { reload } from '../utils';
import { viewMainPage } from '../view/view_store';

import Setting from './Setting.svelte';
import * as settingStore from './setting_store';

const performDestroyStorage = () => destroy().chain((_) => reload());
const performCompactStorage = () => cleanUp();

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
    setRef(settingStore.backFromSettingPage, () => addSop(() => goToGrid())),
  ]);

export { goToSettingPage };
