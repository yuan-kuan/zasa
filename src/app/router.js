import daggy from 'daggy';
import Future from 'fluture';
import page from 'page';
import { Path } from 'path-parser';

import * as free from 'fp/free';
import { addSop } from 'fp/sop';

import { goToItem, goToItemCreation } from 'app/sop/item';
import { goToSettingPage } from 'app/sop/setting';
import { goToHome } from 'app/sop/home';

const Navigation = daggy.taggedSum('Navigation', {
  Show: ['path', 'params'],
});
const { Show } = Navigation;

const nagivationToFuture = (p) =>
  p.cata({
    Show: (path, params) =>
      Future((_, resolve) => {
        const newPath = new Path(path).build(params);

        if (newPath != page.current) {
          page.show(newPath, page.prevContext, false, true);
        }

        resolve(newPath);
        return () => { };
      }),
  });

const setUrl = (path, params) => free.lift(Show(path, params));


const gridPath = '/';
const itemCreatePath = '/item';
const itemPath = '/item/:itemId';
const settingPath = '/setting';

const setHomeUrl = () => setUrl(gridPath);
const setItemUrl = (itemId) => setUrl(itemPath, { itemId });
const setItemCreationUrl = () => setUrl('/item');
const setSettingUrl = () => setUrl(settingPath);

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

  page('*', () => {
    console.error('Unknown path');
  });
  page();
}

export const navigationInterpretor = [Navigation, nagivationToFuture];
export { start, setHomeUrl, setItemUrl, setItemCreationUrl, setSettingUrl };
