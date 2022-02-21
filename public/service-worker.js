'use strict';

// Update cache names any time any of the cached files change.
const CACHE_NAME = 'release-2';

// Add list of files to cache here.
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/favicon.png',
  '/build/bundle.css',
  '/build/bundle.js',
  '/images/b4_logo72_144.png',
];

self.addEventListener('install', (evt) => {

  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  // Remove previous cached data from disk.
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );

  self.clients.claim();
});

self.addEventListener('fetch', (event) => {

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        return networkResponse;
      })
      .catch(() => {
        console.log('[ServiceWorker] Fetch failed, return from cache');
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log('[ServiceWorker] Cache found!');
            return cachedResponse;
          } else {
            console.log('[ServiceWorker] Cache not found!');
            return caches.match('/').then((res) => res);
          }
        });
      })
  );
});
