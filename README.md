# ZASA - Zombie Apocalypse Survival App

This project serves two purposes:

1. Building this progressive web application that allows the user to build records of food or tools with their expiring date and stock count.
2. Demonstrate how to use [`fp-svelte`](https://github.com/yuan-kuan/fp-tailwindcss-svelte-template) to build a functional architectured web application.

## The application

[Link To Prototype](https://zasa.pages.dev)

ZASA is a household stock taking application. It let the user build up a record of all their food, tools, ingredient, grain, etc. The record consists of the expiry dates, the amount and the photo of the recorded item. With ZASA, the user will be able to keep track of the stocking status, replenish when low, consume before expired, and source for new provision.

### Features

1. Record each item with its name and photo.
2. Keep track of their expiry by date and stock count, on the same page.
3. Tag items with anything labels. Multiple tags.
4. Filter items with tags.

### PWA and Offline first

ZASA is an offline application. It needs an internet connection when the user visits it the first time, wants to update it with a later version and backup/sync up the database. Other times, it works offline, with all the data and photos store locally in the browser (It will not work with the browser that blocks or does not support local storage & indexed DB).

This takes a progressive web application form to ensure maximum platform support. As long as the device can run a browser, it can install ZASA.

### To run and develop it

1. Clone this project.
2. `npm install`
3. `npm run dev`

## The codes

The final forms, codes in the `main` branch, can be cryptic to someone new to functional programming. Even though they are mostly in plain JavaScript, they are not written typically. The suggested ways to study the codes are doing the step by steps, mentioned below. Another way is to read up the architecture decisions, read up all the references materials (techniques used in the codes) and then study the code.

## Step by Step follow

There is a `DEVLOG.md` which detail the development progress in the early days. It is divided into multiple parts, and each part has a branch of its own in this repository, e.g. `part-5-tag`. Reading the DEVLOG from the end to follow the journey, check out the `part-#-branch` and learn the concepts used in developing this application progressively.

## References / study materials

1. [Professor Frisby's Mostly Adequate Guide to Functional Programming](https://mostly-adequate.gitbook.io/mostly-adequate-guide/).

This is the only book one needs to understand to study the codes. Nevertheless, out of the few books/articles, this is the best (IMO) to learn functional programming from 0.

2. [Svelte Tutorial](https://svelte.dev/tutorial/basics).

Even though the application is architectured in a way to minimize the reliance on the UI framework, it still consists of a lot of Svelte. Especially Svelte Store, which is one of the core functionality to enable this architecture.

3. [Ramda Guide](https://randycoulman.com/blog/categories/thinking-in-ramda/).

There are a few js libraries for functional programming, the weapon of choice here is Ramda. Although this project's architecture favours Professor Frisby's "dot-chainning" method over Ramda's `.pipe` and `.compose` for function chains, this codebase still use a lot of Ramda.

## Architecture Decisions

### Free Monad

Free Monad is chosen out of many techniques to achieve a functional software architecture. Free Monad can turn anything into a monad, be it a value or a function that return a value or a side-effect. The developer will build up the whole functions chain into a single Free Monad, which will be interpreted into side effects later, in a safer place. In Zasa, all Free Monad will be interpreted into a [Fluture's `Future`](https://github.com/fluture-js/Fluture) instance, which will be `fork` in a generator function. More detail is in the SOP section below.

Building functions chain with Free Monad and "dot-chainning" is the most common code pattern throughout the codebase. Here is one example:

```js
const presentFilteredItem = (filterTags) =>
  free
    .of(filterTags)
    .chain(getItemsWithTags)
    .chain((items) =>
      free.sequence([setRef(gridStore.items, items), presentGoToItems(items)])
    );
```

1. We want to operate in Free Monad most of the time. When starting with a value, we lift it into a FreeMonad.
2. The point of using Monad is the ability to `map`, `chain` the content with another function within the Monad. `getItemWithTags` will return another Free Monad, but it takes `filterTags` as a parameter, so, we `chain` it.
3. In case multiple functions have no relationship with each other but are meant to happen in a series, use `free.sequence` to convert the `[ Free Monad]` into `FreeMonad []`.

This will be alien to a lot of web developers/software engineers, but take a moment to read the function. While there is a lot of encapsulation, one can easily guess and see what is going on here.

### Driving the UI with Svelte Store

Our functional core dictates a lot of the UI building logic. Some examples:

- Deciding which page is it. Which Svelte Component should be loaded as the main page.
- Deciding what is the current URL. Changing the path as the user navigates, populate params.
- Deciding what goes into the variables. These variables are bound to the template.
- Deciding all the possible events/callbacks available on the page. UI just invoke the callback without knowing what is it.

All the "deciding"s are setting new value into [Svelte Store](https://svelte.dev/tutorial/writable-stores). Our Svelte components are set up to react to these Svelte Stores. The templates are declared in `.svelte` like usual, with binding to the stores all set and done. Different from other styles of using Svelte, our Svelte components do not call function, send event or pull values from other places. They will only react to Svelte Stores.

The obvious question to ask here is: How about handling user interaction or sending back any sort of UI event? The way we do it is by setting up [closure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) and `setRef` them into Svelte Store. On the Svelte Component side, the developer just makes sure the correct closure is invoked at the right moment. These closures can contain the correct context to call the right function when invoked. e.g. `GoToItem(itemId)`, when there are 10 items displayed, we can pass in a closure for each of them with the `itemId` passed in. The benefit of this decouples the Svelte Component from the API. UI does not need to know which function, `GoToItem`, to call and what parameter to pass in, `itemId`.

All these side effects will be contained by a Free Monad and interpret at once in the final go. Check out the following code sample:

```js
import Grid from './Grid.svelte';

const goToGrid = () =>
  free.sequence([
    viewMainPage(Grid),
    setGridUrl(),
    presentFilterAndItem(),
    setRef(gridStore.goToCreateItem, () => addSop(() => goToItemCreation())),
    setRef(gridStore.goToSetting, () => addSop(() => goToSettingPage())),
  ]);
```

1. We pass `Grid`, the Svelte Component, into `viewMainPage` function, signalling to show this as the main page.
2. We call a function that will set up the URL to the correct path.
3. We call a function to set up the filter and items grid.

   3.1. This function is shown in the section above. The notable line is `setRef(gridStore.items, items)`, which pass in the list of Items into a Svelte Store. As you may guess, the Svelte Component will use this information to populate the grid

4. We define two closure and `setRef` them into the Svelte Store.
5. `goToGrid` will be called by the router when the user type in the path in the address bar, or the user is navigated to the grid from other functions (back from Item page, changed filter, etc).

### Step of Procedures (SOP)

All these Free Monads need to be interpreted to Future and then "someone" needs to `fork` these futures into actions. This responsibility belongs to `SOPManager`. Similar to JavaScript's event loop, it lets developers queue up SOP, run them one by one until there is none and wait for the next one idly. Each SOP is a Free Monad. Running one means to interpret them to Future and fork. Queue up new SOP is the only thing develop need to do to keep this system running.

This architecture does not limit or give guidance on how big or small each SOP to be. From the way the ZASA application is written, each SOP is from the start until the end of each event. Events range from clicking a link, clicking a button, changing the browser's URL, to uploading an image.

All event starts a new SOP. In the actual codes, this mean executing this line: `addSop(() => functionThatReturnFreeMonad())`.

Some SOP is big, some are small. Big ones are like `goToGrid`, which detailed what URL to display, which Svelte Component to show as the main page, do the filtering of items and show them in the grid, prepare the Filter, etc. Small SOP is like `EditName`, which only load up the database, change the record, save it and change the corresponding Svelte Store.

What's important is the open-ended approach of each SOP. A complete picture of all steps of the procedure to perform from the start of the event to the final UI presentation of it.

## Backup

ZASA is an offline application that store all data and picture in the browser's local storage. This is the primary usage pattern we envisioned. A remote backup, though, is a very important factor to make users felt safe with all their works (recording these stocks are a lot of work, maintaining them is another beast).

In the production ZASA application, users may acquire a backup code from the author via sending a personal email. With this code, the user can sync their local storage to a remote database. Later, they can download this backup back to the same device, or any other device. It is more than a backup, it is also a remote sync point. All the user needs is a backup code.

But, a remote backup can be an expensive business for the authors to maintain for free. It is by design that none of the backup options is available for developers who fork or clone this project. They need to set up the backup plan themselves.

### Local Backup

When the developer is developing the backup or improving it, is better to be done with a local CouchDB instance:

1. Setup a local CouchDB instance
2. Add a `.env` or `.env.local` file to the project. `.env.local` will be used when developing with `npm run local` command.
3. Add these 3 variables to the `.env` file:

   ```
   LOCAL_DB_URL=http://localhost:5984
   LOCAL_DB_USERNAME=admin
   LOCAL_DB_PASSWORD=password
   ```

4. Change the value to the appropriate one
5. Restart your development build

## Question?

Reach out to me at kuan@hey.com or file an issue. Thank you for checking this out!
