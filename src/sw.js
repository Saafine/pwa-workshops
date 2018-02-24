/* eslint-disable no-undef,no-restricted-globals */
const { assets } = serviceWorkerOption;
const CACHE_NAME = new Date().getTime().toString();

console.log(CACHE_NAME);

/**
 * Cache all bundle assets (index.html, script.js, styles, images) and save to cache.api
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assets);
    })
  );
});

/**
 * Remove old caches (not matching our current cache name)
 */
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (cacheWhitelist.indexOf(key) === -1) {
          console.log('deleting cache with key:', key);
          return caches.delete(key);
        }
      }));
    }));
});

/**
 * Intercept all requests and:
 * - return response from cache if found
 * - return index.html fallback from sub-routes
 * - ignore requests and response coming from our dev server and chrome extensions
 * - fetch other requests and cache them if needed
 */
self.addEventListener('fetch', function(evt) {
console.log('The service worker is serving the asset.');
evt.respondWith(fromCache(evt.request));
evt.waitUntil(update(evt.request));
});

function fromCache(request) {
  return caches.open(CACHE_NAME).then(function (cache) {
    return cache.match(request).then(function (matching) {
      return matching || Promise.reject('no-match');
    });
  });
}

function update(request) {
  return caches.open(CACHE_NAME).then(function (cache) {
    return fetch(request).then(function (response) {
      return cache.put(request, response);
    });
  });
}
