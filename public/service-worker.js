'use strict';

// Update cache names any time any of the cached files change.
const CACHE_NAME = 'test-cache-5';

// Add list of files to cache here.
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/favicon.png',
  '/build/bundle.css',
  '/build/bundle.js',
  '/images/zasa_logo144_72.png',
];

self.addEventListener('install', (evt) => {
  console.log('[ServiceWorker] Install');

  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching offline page');
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  // Remove previous cached data from disk.
  console.log('[ServiceWorker] Activate');
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );

  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  console.log('[ServiceWorker] Fetch', event.request);

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
