import App from 'view/App.svelte';

import { addSop, registerStaticInterpretor } from 'fp/sop';
import { navigationInterpretor, start } from 'app/router';
import { gridSetup } from 'app/sop/grid';
import { setupHome } from 'app/sop/home';
import { setupDatabaseInterpretor } from 'app/database';
import { kvInterpretor } from 'app/kv';
import { utilsInterpretor } from 'app/utils';
import { setupBackupInterpretor } from 'app/sop/backup';
import { filterInterpretor } from 'app/sop/filter';

// Setup SOP manager
registerStaticInterpretor(setupDatabaseInterpretor());
registerStaticInterpretor(kvInterpretor);
registerStaticInterpretor(navigationInterpretor);
registerStaticInterpretor(utilsInterpretor);
registerStaticInterpretor(setupBackupInterpretor());
registerStaticInterpretor(filterInterpretor);

addSop(() => gridSetup());
addSop(() => setupHome());

start();

// Kick start Svelte
const app = new App({
  target: document.body,
});

export default app;
