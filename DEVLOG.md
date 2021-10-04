## Part 6

### All About Image

Since we are storing image files locally in the browser, in IndexedDB/PouchDB, which made it clear that they are not excellent in storing binary files, we got to be careful with the file sizes. Users are 99% likely to use a mobile phone camera to take the photo, which is usually in the range of 3 to 5 MB. We want to store smaller, way smaller, images than that. The reasons:

1. We just need a good enough photo which helps users recognize the item quickly. As long as the image is not marred to the point of unrecognizable, we can go down a lot in terms of quality, resolution and DPI.
2. Supporting various aspect ratios are useless since the application already force a square image in all UI. Instead of clipping the image and did a bad job at it, we rather the user crops the photo into a square before letting us save it.
3. Even though the modern mobile phone has big internal storage, we are still storing these images in a browser's storage, which usually has a limited disk space quota relative to the total free space.
4. We will let users back up their data into a remote database, and sync it to other devices. The leaner the data, the faster the sync process.

### No new functional codes this time?

We introduced three new technologies (third party libraries) into the project but none of them transformed into functional codes. They are both loaded and used in the Svelte front. Just like we rely on `<input type="image">` to automate the whole photo picking/shotting UX flow, we rely on these three libraries to crop and resize our image to a manageable size before we saving it to the database.

[`svelte-easy-crop`](https://github.com/ValentinH/svelte-easy-crop) is a nice little Svelte Component that applies a simple cropping UI to any image on the page. It works like a charm in all browsers. With its output, we can pass the crop parameters into the next tool to do the actual image cropping.

[`canvasUtils` gist by Valentin Hervieu](https://github.com/ValentinH) is a small piece of code that uses Canvas2D to crop an image. It is a gist in GitHub but works wonderfully. It just does the cropping though, we still need to resize the image to bring down the size.

[`pica`](https://github.com/nodeca/pica) is a well-known image processing JS library. With one line of code, we downscale our original photo to a manageable 256x256 resolution in all browsers, under 1 second.

### Caveats and bumpy road

This branch is lacking a lot of hotfixes that happened later in the `staging` branch. Following are the issues and solutions:

1. iOS Safari has a restrictive memory usage limit when dealing with Canvas2D. I made the mistake to crop the image first and resize it second, which result in a black image in iPhone. `pica` does its magic to work around the limitation, hence resizing first before cropping the image solve the problem.

2. To use `pica`'s WASM and Web Worker mode, we need to provide extra configuration to `terser` in `rollup.config.js`. Otherwise, the web worker code will be missing in the production build.

## Part 5 (Tue Sep 14 14:39:04 MYT 2021)

### Second level sum type / free monad in interpetion

So far, we only have one kind of sum type - those we used to encapsulate side effects. e.g. Database, KV, SetRef. The second level sum type that we are introducing now is an encapsulation of complex logic, not necessary just side effects. The filter is complicated enough to use a second level sum type.

The Filter sum type encapsulates the logic of working with Tags and Items. The primary reason to use a second-level sum type is to simplify the caller's code. Instead of forcing the high-level caller to know all the detail of using Filter, e.g. KV's key name, PouchDB design doc's id, we hid these details away from the high-level caller.

### Tagging and Filtering made easy

Tagging and filtering look easy and simple in ZASA largely thanks to PouchDB, specifically, with CouchDB/PouchDB Map/Reduce View.

There is a map function that creates a new view with the `tag` as key and `docId` as value. To filter items by their tags, just query this view with the tags as multiple keys.

The bonus is a reduce function with the built-in function `_count` onto this View. It will produce an array of `"tag":"count"`. With this, we can know how many tags are in total, and how many of them each.

## Part 4 (Wed Sep 8 21:21:26 MYT 2021)

### Organization of functions

More and more functions are introduced into our codebase, that's just normal as life, changes happen and one is piling up stuff (or craps) as it goes on.

Anyway, we should do something about the onslaughts of functions (this is FP, we have only functions, a lot of them). The naming of functions is especially important, as that is our only way to let others know what's going on. The second important is where we parking those functions.

1. Naming

One style I managed to stick with, is using a verb for function, a noun for a variable. There are a few naming conventions that I used in the codebase. e.g. `present` for a function that ends up with setting a Svelte Store variable, `goto` for a function that changes the page in a big way, `perform` is similar but it does not change the navigation, e.t.c.

2. File structure

I am keeping all framework and utility functions in root level files: e.g. free_monad.js, router.js, database.js. The reason is simple: I can see a shorter import statement.

All business logic files keep under their business function folder, like Grid and Item.

### Single purpose addSop closure

With the introduction of expiry batches in the Edit Item page, we come across another style in FP-svelte, the single purpose `addSop` closure. Particularly, these refer to the functions we passed in via `ItemStore.performBatchInc`, `ItemStore.performBatchDec` and `ItemStore.performDeleteBatch`.

Each batch (item in a batches array) will have its version of closure setup. Triggering this individual closure will start a specific action, e.g. adding one to batch #2. What is different from the earlier function call from the Svelte component is: we do not need to know what parameter we need to pass in for these single-purpose closures, we just need to call the correct one, i.e. same index in a different array.

The goal of using single-purpose closure is to lose the coupling between the Svelte component and calling API (if we deemed invoking this closure is API call). Svelte just need to know when and which to invoke the function but does not need to know what to pass into it. Business logic can change the function name or the signature of it as much as they like, it will not affect the Svelte component.

## Part 3 (Wed Sep 1 14:45:16 MYT 2021)

### More Dot Chaining

```'js'
const performEditName = (itemId, name) =>
  free
    .of(itemId) //
    .chain(get)
    .map(R.set(ItemL.name, name))
    .chain(put)
    .map(R.view(ItemL.name))
    .chain(setRef(itemStore.name));
```

Consider that this function will be called once the user clicks on the "Edit Name" button. Now, as a developer, you like to follow all the events that happen after the click. They are all, in 6 lines:

1. We put `itemId` into a box, the Free Monad box.
2. We hit the database to get the document for `itemId`. Chain because `get` return a Free Monad.
3. We want to update the item document with a new `name`: We use `map` and setting the lense with the new name. After step 2, our Free Monad will be containing a PouchDB document, so, we pass it into the `R.set` function to get a new document.
4. Changed doc? Pass it back to the database. `.chain()` and `put`, should be obvious now.
5. Our special version of `put` return the changed doc, instead of just the `rev` like normal PouchDB. We wrote our interpreter after all. So, we read the new name from the updated document, using lense.
6. Lastly, we update the `itemStore.name` store variable with the new name. This will trigger Svelte and update our HTML next tick.

That complete the cycle. No other side effect or services/component/listener will react to this mouse click. Everything that will and should happen, all laid out in this function.

### Free Monad and Dot Chaining

We have a lot of these:

```'js'
const presentItem = (itemId) =>
  free
    .of(itemId) //
    .chain(getItemWithBlob)
    .chain((itemWithBlob) =>
      free.sequence([
        setRef(itemStore.name, itemWithBlob.name),
        setRef(itemStore.photoBlob, itemWithBlob.blob),
      ])
    );
```

Free Monad is the centre of our "universe", the cornerstone of our functional architecture. We use them all over the place. All SOPs return a Free Monad, which will be interpreted to corresponding Future, which later will be called `fork()` to execute all codes/actions/commands. All side effects are protected in Free Monad, and side effects are inevitable for any software, a web application has a ton of side effects.

Going through the code sample above:

1. We put `itemId` into a Free Monad with `free.of()`.
2. We `chain` it to `getItemWithBlob(string)`. This means: Invoke `getItemWithBlob` with the content of the caller Free Monad, i.e. an `ItemId`.
3. We used `chain` because `getItemWithBlob` return a Free Monad. By chaining it, we get back a FreeMonad containing the result of calling the function.
4. We then `chain` again to an anonymous function, which again, will return a Free Monad.
5. In the anonymous function, we use `free.sequence` to serialized two separated `setRef` functions (return a Free Monad), into a FreeMonad.

The most important point to make here is calling `presentItem()` will return a Free Monad. But no side-effects code has been run so far. This Free Monad merely containing the instructions of doing things. It never really do anything, i.e. Never hit the database, never set the Svelte Store reference. All these side-effects will be done only when Free Monad has been interpreted and `fork()`, by the `SOPManager.js`.

To learn more about Monad, you need to complete this book: https://mostly-adequate.gitbook.io/mostly-adequate-guide/. If you still following this repo after part 2, you should be interested enough in functional programming to finish this book. It is the foundation of `fp-svelte`.

### Aim for Calculation (pure function), test them ASAP

Free Monad functions do not have much to test. They are pure and usually contain no logic before we interpret them and `fork()` the result. As much as possible, we want to make Calculation functions, a pure function that gives the same output for the same input. We had come across a couple of times but we never make a good effort to isolate them into another module and protect them with unit tests.

The first candidate is `item.test.js`, which currently contains tests of `makeItemDoc`. As soon as we made a business logic module, we should use Test-Driven Development on exported functions. This will reduce the slowdown of writing bulk tests.

## Part 2 (Tue Aug 31 16:25:44 MYT 2021)

### Create items, take a photo, store them and show all items in Grid

To create a new item, we pass up a closure that expects two arguments and will trigger an SOP to `performSaveitem` if Svelte Component invoke it. i.e. Click on the Save button. To save an item with its photo, one just takes the value of input and blob from file input, pass both of them into the closure.

In the `performSaveItem` SOP, we first `create` the item with its name, chain the result of using this Free Monad to the next `attach` function. `create` and `attach` both return a Free Monad. They do not perform any side effects, in other words: pure function. To use the result of a Free Monad in a function that results in another Free Monad, we use `.chain()`. After this database steps, we sequence it with a `goToGrid` Free Monad. A sequence is simply unwrapping a `[Free Monad X, Free Monad Y]` to a `Free Monad [X, Y]`. X and Y have no relationship at all besides being a series of isolated steps.

In the `goToGrid` SOP, we add a new step to read all the items from the database and set the result to a new ref(Svelte Store). The Grid Component will add a new template to iterate this new ref (which is a list) and display the stored Items.

### PouchDB with intepretor

For all side-effects, e.g. CRUD of a database, network fetch, setting ref(Svelte Store), `fp-svelte` demand wrapping these effects with a Free Monad. PouchDB store data in browser's IndexedDB, that is a side-effect. To let the user safely use Free Monad in logic and push all the side-effect code to the Future (during `fork()`), we need to write the interpreter.

There is some boilerplate code that one needs to write for each interpreter:

1. Using `daggy` to create the Sum type. Defining all the possible functions for this sum type.
2. Write a `<sumtype>ToFuture` function. This is the interpreter. It returns a Fluture's Future that runs side-effecting codes base on the Type.
3. Export functions that return a FreeMonad for each sum type, by lifting the sum type into a Free Monad.

## Part 1 (Mon Aug 30 15:19:16 MYT 2021)

### `setRef` and Svelte Store

Fp-svelte uses Svelte Store extensively. Component imports the destinated Store and reactively display the store's value via the template. For user interaction, the component will hook it up with Store's values too, which now is a closure, i.e. an enclosed function that will trigger a stored SOP.

SOP is the one responsible to put value into these Svelte Store, via a utility function called `setRef`.

### SOP

All business logic is done in SOPs, which is a plain JS function that returns a Free Monad. An SOP is usually triggered by an event: navigating event from the router, button's click, form submission, p2p data event, etc. It will then complete a series of event/action/side-effects: changing the Svelte Component, change the URL, update values, download photos, save to database, fetch internet JSON, etc. The idea is to have a complete view of actions after each event.

Svelte Component should not contain any business logic.

### Router

Building on top of `page.js`, we introduce a new module to be the router of our SPA. When a user visits our app with a URL, our router will call the corresponding SOP for the user. Our router is responsible to provide a utility function to update the URL too.

In `fp-svelte`, we do not navigate with URL directly, i.e. push a new URL to the history stack. When we navigated users from one page to another, we spell all the things to happen in a single SOP, Steps of Procedures. These include changing the Svelte component, adding a new URL to the history stack without triggering browser navigation, setting new values to references/Svelte Stores, etc.

This is the first module we make use of Interpreter and Free Monad. But we do not talk about them now.

### SPA with PageJS

1. Get `page.js`

   ```bash
   npm install page
   ```

2. Serve application in SPA mode. Add a `-s` to the start in `package.json`

   ```json
     "start": "sirv public -s"
   ```

3. Add some routes. Each route in fp-svelte usually end with `addSop(() => FreeMonad)`.
4. To load a Svelte Component into the page, use the helper function `viewMainPage(SvelteComponent)`. This function returns a `FreeMonad`, which is the right thing to use inside an `addSop()`. For example, to load an Item component when the user navigated to `/item/apple`, do this:

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
