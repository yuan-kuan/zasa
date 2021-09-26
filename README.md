# ZASA - Zombie Apocalypse Survival App

This project serves two purpose:

1. Building this web application (later PWA) which allows the user to build a records of food or tools with their expiring date and stock count.
2. Demonstrate how to use `fp-svelte` to build a functional architectured web application.

## The application

ZASA is a household stock taking application. It let the user build up a record of all their food, tools, ingredient, grain, etc. The record consists of the expiry dates, the amount and the photo of recorded item. With ZASA, the user will be able to keep track of the stocking status, replenish when low, consume before expired, and sourcing for new provision.

### Features

1. Record each item with their name and photo.
2. Keep track of their expiry by date and stock count, in the same page.
3. Tag item with anything labels, multiple of tags.
4. Filter items with tags.

### PWA and Offline first

ZASA is an offline application. It needs internet connection when the user visit it the first time, wants update it with a later version and backup/sync up the database. Other times, it works offline, with all the data and photos store locally in the browser (It will not work with browser that block or does not support local storage & indexed DB).

This take a web application (later PWA) form to ensure maximum platform support. As long as the device can run a browser, it can install ZASA.

## The codes

The final forms, codes in the `main` branch, can be cryptic to someone new to functional programming. Eventhough they are mostly in plain JavaScript, they are not written in the common way. The suggested ways to study the codes are doing the step by steps, mentioned below. Another way is read up the architecture decisions, read up all the references materials (techniques used in the codes) and then study the code.

### Step by Step follow

There is a `DEVLOG.md` which detail the development progress at the early days. It divided into multiple parts, and each part has a branch of its own in this repository, e.g. `part-5-tag`. Reading the DEVLOG from the end to follow the journey and slowly learn the concepts used in developing this application.

### References / study materials

1. [Professor Frisby's Mostly Adequate Guide to Functional Programming](https://mostly-adequate.gitbook.io/mostly-adequate-guide/).

This is the only book one needs to understood to study the codes. Nevertheless, out of the few books/articles, this is the best (IMO) to learn functional programming from 0.

2. [Svelte Tutorial](https://svelte.dev/tutorial/basics).

Even though the application is architectured the way to minimize the relying on the UI framework, it still consist a lot of Svelte. Especially Svelte Store, which is one of the core functionality to enabled this architecture.

3. [Ramda Guide](https://randycoulman.com/blog/categories/thinking-in-ramda/).

There are a few js libraries for functional programming, the weapon of choice here is Ramda. Although this architecture favors Professor Frisby's "dot-chainning" method over Ramda's `.pipe` and `.compose` for function chains, this code base still use a lot of Ramda.

### Architecture Decisions

#### Free Monad

Free Monad is choosen out of many techniques to achieve a functional software architecture. Free Monad can turns anything into a monad, be it a value or a function that return a value or a side-effect. Developer will build up the whole functions chain into a single Free Monad, which will be interpret into side effects later, in a safer place. In Zasa, all Free Monad will be interpreted into a [Fluture's `Future`](https://github.com/fluture-js/Fluture) instance, which will be `fork` in a generator function. More detail in the SOP section below.

Building functions chain with Free Monad and "dot-chainning" is the most common code patterns throughout the code base. Here is one example:

```'js'
const presentFilteredItem = (filterTags) =>
  free
    .of(filterTags)
    .chain(getItemsWithTags)
    .chain((items) =>
      free.sequence([setRef(gridStore.items, items), presentGoToItems(items)])
    );
```

1. We want to operate in Free Monad most of the time. When starting with a value, we lift it into a FreeMonad.
2. The point of using Monad is the ability to `map`, `chain` the content with another function within the Monad. `getItemWithTags` will return another Free Monad, but it takes `filterTags` as parameter, so, we `chain` it.
3. In case there are multiple functions that has no relationship with each other but meant to happen in a series, use `free.sequence` to convert the `[ Free Monad]` into `FreeMonad []`.

This will be alien to a lot of web developer/software engineer, but take a moment to read the function. While there are a lot of encapsulation, one can easily guess and see what is going on here.

#### Driving the UI with `setRef`

#### Everything is a Step of Procedures (SOP)

####
