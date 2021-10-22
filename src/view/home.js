import * as free from '../free_monad';
import { viewMainPage } from './view_store';

import { Nav } from '../stores';
import Home from './Home.svelte';
import { presentGrid } from '../grid/grid';
import { setHomeUrl } from '../router';
import { setRef } from '../ref';
import { addSop } from '../sop';
import { goToItemCreation } from '../item/item';
import { goToSettingPage } from '../setting/setting';

const setupHome = () => free.sequence([
  //TODO: set this static NAV closure in ItemCration/ setting module instead?
  setRef(Nav.goToCreateItem, () => addSop(() => goToItemCreation())),
  setRef(Nav.goToSetting, () => addSop(() => goToSettingPage())),
]);

const goToHome = () => free.sequence([
  // TODO: Do not call setup here, this trigger lot of time
  setupHome(),
  viewMainPage(Home),
  setHomeUrl(),
  presentGrid(),
]);

export { setupHome, goToHome };