import App from 'view/App.svelte';

import { addSop, registerStaticInterpretor } from 'fp/sop';
import { start } from 'app/router';
import { gridSetup } from 'app/sop/grid';
import { setupHome } from 'app/sop/home';
import { dispatcher, setupDatabaseDispatcher } from 'app/database';

// Setup SOP manager
registerStaticInterpretor(setupDatabaseDispatcher());

addSop(() => gridSetup());
addSop(() => setupHome());

start();

// Kick start Svelte
const app = new App({
  target: document.body,
});

export default app;
