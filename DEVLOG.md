## Mon Aug 30 15:19:16 MYT 2021

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
