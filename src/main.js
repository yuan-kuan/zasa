import App from './view/App.svelte';
import { start } from './router';

start();

// Kick start Svelte
const app = new App({
  target: document.body,
});

export default app;
