import App from 'view/App.svelte';

import { addSop } from 'fp/sop';
import { start } from 'app/router';
import { gridSetup } from 'app/sop/grid';
import { setupHome } from 'app/sop/home';

addSop(() => gridSetup());
addSop(() => setupHome());

start();

// Kick start Svelte
const app = new App({
  target: document.body,
});

export default app;
