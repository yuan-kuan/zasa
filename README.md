# ZASA - Zombie Apocalypse Survival App

This project serves two purpose:

1. Building this web application (later PWA) which allows the user to build a records of food or tools with their expiring date and stock count.
2. Demonstrate how to use `fp-svelte` to build a fully functional architectured web application.

## The application

ZASA is a household stock taking application. It let the user build up a record of all their food, tools, ingredient, grain, etc. The record consists of the expiry dates, the amount and the photo of recorded item. With ZASA, the user will be able to keep track of the stocking status, replenish when low, consume before expired, and sourcing for new provision.

### Features

1. Record each item with their name and photo.
2. Keep track of their expiry by date and stock count, in the same page.
3. Tag item with anything labels, multiple of tags.
4. Filter items with tags.

### PWA and Offline first

ZASA is an offline application. It needs internet connection when the user visit it the first time, wants update it with a later version and backup/sync up the database. Other than these, it work offline, with all the data and photos store locally in the browser (It will not work with browser that block or does not support local storage & indexed DB).

This take a web application (later PWA) form to ensure maximum platform support. As long as the device can run a browser, it can install ZASA.

## The codes

### Step by Step follow

There is a `DEVLOG.md` which detail the development progress at the early days. It divided into multiple parts, and each part has a branch of its own in this repository, e.g. `part-5-tag`. Reading the DEVLOG from the end to follow the journey and slowly learn the concepts used in developing this application.
