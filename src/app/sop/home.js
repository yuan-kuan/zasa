import * as free from 'fp/free_monad';
import { setRef } from 'fp/ref';
import { addSop } from 'fp/sop';
import { viewMainPage } from 'fp/view_store';

import Home from 'view/Home.svelte';

import { Nav } from 'app/stores';
import { presentGrid } from './grid';
import { setHomeUrl } from '../router';
import { goToItemCreation } from './item';
import { goToSettingPage } from './setting';

const setupHome = () => free.sequence([
  //TODO: set this static NAV closure in ItemCration/ setting module instead?
  setRef(Nav.goToCreateItem, () => addSop(() => goToItemCreation())),
  setRef(Nav.goToSetting, () => addSop(() => goToSettingPage())),
  setRef(Nav.backToHome, () => addSop(() => goToHome())),
]);

const goToHome = () => free.sequence([
  viewMainPage(Home),
  setHomeUrl(),
  presentGrid(),
]);

export { setupHome, goToHome };