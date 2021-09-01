## Wed Sep 1 14:45:16 MYT 2021

###

### Aim for Calculation (pure function), test them ASAP

Free Monad functions do not have much to test. They are pure, but they usually contain no logic before we interprete them and `fork()` the result. As much as possible, we want to make Calculation functions, a pure function that give the same output for the same input. We had come across them couple of time but we never make a good effort to isolate them into another module and protect them with unit test.

Now we have the first candicate, creation of the Item PouchDB document. There are more works can be done this way, moving codes to calculations, especially in our `database.js` interpretor, those function are bloated with our own logic, i.e. returning a data structure with specific field and blob. Eventually we will want our interpretor to be lean, do one thing only. And using Calculation to handle our own business logic.

## Tue Aug 31 16:25:44 MYT 2021

### Create item, take photo, store them and show all items in Grid

To create a new item, we pass up a closure that expect two arguments and will trigger a SOP to `performSaveitem` if Svelte Component invoke it. i.e. Click on the Save button. To save an item with it's photo, one just take the value the of input and blob from file input, pass both of them into the closure.

In the `performSaveItem` SOP, we first `create` the item with it's name, chain the result of using this Free Monad to the next `attach` function. `create` and `attach` both return a Free Monad. They do not perform any side-effects, in other word: pure function. To use the result of a Free Monad in function that result another Free Monad, we use `.chain()`. After this database steps, we sequence it with a `goToGrid` Free Monad. Sequence is simply unwrap a `[Free Monad X, Free Monad Y]` to a `Free Monad [X, Y]`. X and Y has no relationship at all beside being a series of isolated steps.

In the `goToGrid` SOP, we add new step to read all the item from the database, and set the result to a new ref(Svelte Store). The Grid Component will add a new template to iterate this new ref (which is a list) and display the stored Items.

### PouchDB with intepretor

For all side-effects, e.g. CRUD of database, network fetch, setting ref(Svelte Store), fp-svelte demand wrapping these effect with a Free Monad. PouchDB store data in browser's IndexedDB, that is definitely a side-effect. To let user safely use Free Monad in logic and push all the side-effect code to the Future (during `fork()`), we need to write the intepretor.

There are some boilerplated code that one need to write for each intepretor:

1. Using `daggy` to create the Sum type. Defining all the posible functions for this sum type.
2. Write a `<sumtype>ToFuture` function. This is the interpretor. It return a Fluture's Future that runs side-effecting codes base on the Type.
3. Export functions which return a FreeMonad for each sum type, by lifting the sum type into a Free Monad.

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
