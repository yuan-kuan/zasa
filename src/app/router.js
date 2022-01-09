import daggy from 'daggy';
import Future from 'fluture';
import page from 'page';
import { Path } from 'path-parser';

import * as free from 'fp/free';
import { addSop } from 'fp/sop';

import { goToItem, goToItemCreation } from 'app/sop/item';
import { goToSettingPage } from 'app/sop/setting';
import { goToHome, goToHowTo, goToInfo, goToRelease } from 'app/sop/home';

const Navigation = daggy.taggedSum('Navigation', {
  Show: ['path', 'params'],
});
const { Show } = Navigation;

const nagivationToFuture = (p) =>
  p.cata({
    Show: (path, params) =>
      Future((reject, resolve) => {
        try {
          const newPath = new Path(path).build(params, { ignoreConstraints: true });

          if (newPath != page.current) {
            page.show(newPath, page.prevContext, false, true);
          }

          resolve(newPath);
        } catch (error) {
          reject(`Navigation error: ${error} when path is ${path} and params are ${JSON.stringify(params)}`);
        }
        return () => { };
      }),
  });

const setUrl = (path, params) => free.lift(Show(path, params));


const gridPath = '/';
const itemCreatePath = '/item';
const itemPath = '/item/:itemId';
const settingPath = '/setting';
const infoPath = '/info';
const howtoPath = '/howto';
const releasePath = '/releases';

const setHomeUrl = () => setUrl(gridPath);
const setItemUrl = (itemId) => setUrl(itemPath, { 'itemId': encodeURIComponent(itemId) });
const setItemCreationUrl = () => setUrl('/item');
const setSettingUrl = () => setUrl(settingPath);
const setInfoUrl = () => setUrl(infoPath);
const setHowToUrl = () => setUrl(howtoPath);
const setReleaseUrl = () => setUrl(releasePath);

function start() {
  page('/', () => {
    addSop(() => goToHome());
  });

  page(itemCreatePath, (ctx) => {
    addSop(() => goToItemCreation());
  });

  page(itemPath, (ctx) => {
    addSop(() => goToItem(ctx.params.itemId));
  });

  page(settingPath, (ctx) => {
    addSop(() => goToSettingPage());
  });

  page(infoPath, (ctx) => {
    addSop(() => goToInfo());
  });

  page(howtoPath, (ctx) => {
    addSop(() => goToHowTo());
  });

  page(releasePath, (ctx) => {
    addSop(() => goToRelease());
  });

  page('*', () => {
    console.error('Unknown path');
  });
  page();
}

export const navigationInterpretor = [Navigation, nagivationToFuture];
export { start, setHomeUrl, setHowToUrl, setInfoUrl, setItemUrl, setItemCreationUrl, setSettingUrl, setReleaseUrl };
