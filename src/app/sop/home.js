import * as free from 'fp/free';
import { setRef } from 'fp/ref';
import { addSop } from 'fp/sop';
import { viewMainPage, viewSubPage } from 'fp/view';

import Home from 'view/home/Home.svelte';
import InfoOnePager from 'view/info/InfoOnePager.svelte';

import { Nav } from 'app/stores';
import { presentGrid } from './grid';
import { setHomeUrl } from '../router';
import { goToItemCreation } from './item';
import { goToSettingPage } from './setting';

const goToinfo = () => free.sequence([
  viewSubPage(Home, InfoOnePager),
  setHomeUrl(),
  presentGrid(),
]);

const setupHome = () => free.sequence([
  //TODO: set this static NAV closure in ItemCration/ setting module instead?
  setRef(Nav.goToCreateItem, () => addSop(() => goToItemCreation())),
  setRef(Nav.goToSetting, () => addSop(() => goToSettingPage())),
  setRef(Nav.goToInfo, () => addSop(() => goToinfo())),
  setRef(Nav.backToHome, () => addSop(() => goToHome())),
]);

const goToHome = () => free.sequence([
  viewMainPage(Home),
  setHomeUrl(),
  presentGrid(),
]);

export { setupHome, goToHome };