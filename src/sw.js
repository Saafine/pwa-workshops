const { assets } = global.serviceWorkerOption;

const CACHE_NAME = 'v1';
const URLS_TO_CACHE = self.serviceWorkerOption.assets;
const URLS_TO_IGNORE = ['chrome-extension', 'sockjs-node'];

self.addEventListener('install', event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;

  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(request).then(response => {
        if (response) {
          return response;
        }

        if (!navigator.isOnline && request.headers.get('accept').includes('text/html')) {
          return cache.match(new Request('/index.html'));
        }

        return fetchAndUpdate(request);
      });
    })
  );
});

function fetchAndUpdate(request) {
  return caches.open(CACHE_NAME).then(cache => {
    return fetch(request).then(response => {
      if (!response.url) return response;

      cache.put(request, response.clone());
      return response;
    });
  });
}

