import daggy from 'daggy';
import Future from 'fluture';
import page from 'page';
import { Path } from 'path-parser';
import * as R from 'ramda';

import * as free from './free_monad';
import { registerStaticInterpretor } from './sop';

import { addSop } from './sop';
import { goToGrid } from './grid/grid';
import { goToItem, goToItemCreation } from './item/item';
import { goToSettingPage } from './setting/setting';

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
        } else {
          console.log('skipped pushing new url to history');
        }

        resolve(newPath);
        return () => {};
      }),
  });

const setUrl = (path, params) => free.lift(Show(path, params));

const navigationInterpretor = [Navigation, nagivationToFuture];
registerStaticInterpretor(navigationInterpretor);

const gridPath = '/';
const itemCreatePath = '/item';
const itemPath = '/item/:itemId';
const settingPath = '/setting';

const setGridUrl = () => setUrl(gridPath);
const setItemUrl = (itemId) => setUrl(itemPath, { itemId });
const setItemCreationUrl = () => setUrl('/item');
const setSettingUrl = () => setUrl(settingPath);

function start() {
  page('/', () => {
    addSop(() => goToGrid());
  });

  page(itemCreatePath, (ctx) => {
    addSop(() => goToItemCreation());
  });

  page(itemPath, (ctx) => {
    console.log('ctx.params.itemId :>> ', ctx.params.itemId);
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

export { start, setGridUrl, setItemUrl, setItemCreationUrl, setSettingUrl };
