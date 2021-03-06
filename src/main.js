import App from 'view/App.svelte';

import { addSop, addToastErrorSop, registerStaticInterpretor } from 'fp/sop';
import { freeUtilsInterpretor } from 'fp/free';

import { navigationInterpretor, start } from 'app/router';
import { gridSetup } from 'app/sop/grid';
import { setupHome } from 'app/sop/home';
import { setupDatabaseInterpretor } from 'app/database';
import { setupKVInterpretor } from 'app/kv';
import { utilsInterpretor } from 'app/utils';
import { setupBackupInterpretor } from 'app/sop/backup';
import { toast } from 'fp/view';

// Use Free Utils
registerStaticInterpretor(freeUtilsInterpretor);

// Setup SOP manager
registerStaticInterpretor(setupDatabaseInterpretor());
registerStaticInterpretor(setupKVInterpretor());
registerStaticInterpretor(navigationInterpretor);
registerStaticInterpretor(utilsInterpretor);
registerStaticInterpretor(setupBackupInterpretor());

addToastErrorSop((error) => () => toast(error));
addSop(() => gridSetup());
addSop(() => setupHome());

start();

// Kick start Svelte
const app = new App({
  target: document.body,
});

export default app;
