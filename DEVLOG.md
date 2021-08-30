## Mon Aug 30 15:19:16 MYT 2021

### `setRef` and Svelte Store

Fp-svelte use Svelte Store extensively. Component imports the destinated Store and reactively display the store's value via the template. For user interaction, component will hook it up with Store's values too, which now is a closure, i.e. a enclosed function that will trigger a stored SOP.

SOP is the one responsible to put value into these Svelte Store, via a utility function call `setRef`.

### SOP

All business logics is done in SOPs, which is a plain JS function that return a Free Monad. A SOP usually triggered by an event: navigating event from router, button's click, form submission, p2p data event, etc. It will then complete a series of event/action/side-effects: chaging the Svelte Component, change the URL, update values, download photo, save to database, fetch internet JSON, etc. The idea is to have a complete view of actions after each event.

Svelte Component should not contains any business logics.

### Router

Building on top of `page.js`, we introduce a new module to be the router of our SPA. When a user visit our app with a URL, our router will call the coresponding SOP for the user. Our router is responsible to provide a utility function to update the URL too.

In fp-svelte, we do not navigate with URL directly, i.e. push a new URL to the history stack. When we navigated user from one page to another, we spell all the things to happen in a single SOP, Steps of Procedures. These include changing the Svelte component, adding new URL to histoy stack without triggering browser navigation, setting new values to references/Svelte Stores, etc.

This is the first module we make use of Interpretor and Free Monad. But we do not talk about them now.

### SPA with PageJS

1. Get `page.js`

   ```'bash'
   npm install page
   ```

2. Serve application in SPA mode. Add a `-s` to the start in `package.json`

   ```'json'
     "start": "sirv public -s"
   ```

3. Add some routes. Each route in fp-svelte usually end with `addSop(() => FreeMonad)`.
4. To load a Svelte Component into the page, use the helper function `viewMainPage(SvelteComponent)`. This function return a `FreeMonad`, which is the right thing to use inside a `addSop()`. For example, to load an Item component when user navigated to `/item/apple`, do this:

   ```'js'
   page('/item/:id', (ctx) => {
     addSop(() => viewMainPage(Item));
   });
   ```

### Start FP svelte from a template

Using `degit`, clone and create a base project

```
npx degit yuan-kuan/fp-tailwindcss-svelte-template <project name>
```
