import App from './view/App.svelte';
import { start } from './router';
import { gridSetup } from './grid/grid';
import { addSop } from './sop';

start();

addSop(() => gridSetup());

// Kick start Svelte
const app = new App({
  target: document.body,
});

export default app;
