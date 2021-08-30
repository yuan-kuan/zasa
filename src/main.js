import page from 'page';

import App from './view/App.svelte';
import Grid from './view/Grid.svelte';
import Item from './view/Item.svelte';

import { addSop } from './sop';
import { viewMainPage } from './view/view_store';

page('/', '/default');

page('/:category', (ctx) => {
  console.log('ctx.params.category :>> ', ctx.params.category);
  addSop(() => viewMainPage(Grid));
});

page('/item/:id', (ctx) => {
  console.log('ctx.params.id :>> ', ctx.params.id);
  addSop(() => viewMainPage(Item));
});

page();

// Kick start Svelte
const app = new App({
  target: document.body,
});

export default app;
