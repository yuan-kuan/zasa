import App from './view/App.svelte';
import Sample from './view/Sample.svelte';

import { addSop } from './sop';
import { viewMainPage } from './view/view_store';

addSop(() => viewMainPage(Sample));

// Kick start Svelte
const app = new App({
  target: document.body,
});

export default app;
