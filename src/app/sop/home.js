import * as free from 'fp/free';
import { setRef } from 'fp/ref';
import { addSop } from 'fp/sop';
import { viewMainPage, viewSubPage } from 'fp/view';

import Home from 'view/home/Home.svelte';
import InfoOnePager from 'view/info/InfoOnePager.svelte';
import HowToOnePager from 'view/info/HowToOnePager.svelte';
import Releases from 'view/info/Releases.svelte';

import { Nav } from 'app/stores';
import { presentGrid } from './grid';
import * as router from '../router';
import { goToItemCreation } from './item';
import { goToSettingPage } from './setting';

const goToInfo = () => free.sequence([
  viewSubPage(Home, InfoOnePager, () => addSop(() => goToHome())),
  router.setInfoUrl(),
  presentGrid(),
]);

const goToHowTo = () => free.sequence([
  viewSubPage(Home, HowToOnePager, () => addSop(() => goToHome())),
  router.setHowToUrl(),
  presentGrid(),
]);

const goToRelease = () => free.sequence([
  viewSubPage(Home, Releases, () => addSop(() => goToHome())),
  router.setReleaseUrl(),
  presentGrid(),
]);

const setupHome = () => free.sequence([
  //TODO: set this static NAV closure in ItemCration/ setting module instead?
  setRef(Nav.goToCreateItem, () => addSop(() => goToItemCreation())),
  setRef(Nav.goToSetting, () => addSop(() => goToSettingPage())),
  setRef(Nav.goToInfo, () => addSop(() => goToInfo())),
  setRef(Nav.goToHowTo, () => addSop(() => goToHowTo())),
  setRef(Nav.goToRelease, () => addSop(() => goToRelease())),
  setRef(Nav.backToHome, () => addSop(() => goToHome())),
]);

const goToHome = () => free.sequence([
  viewMainPage(Home),
  router.setHomeUrl(),
  presentGrid(),
]);

export { setupHome, goToHome, goToInfo, goToHowTo, goToRelease };