const CACHE_KEY = 'tools0';

const PRECACHE = [
  '/index.html',
  '/main.css',
  '/copy.js',
  '/fonts.json',
  '/base64.html',
  '/colors.html',
  '/cron.html',
  '/fonts.html',
  '/formatter.html',
  '/hash.html',
  '/iconic.html',
  '/keycodes.html',
  '/palette.html',
  '/preview.html',
  '/uuid.html',
  '/vendor/cronstrue.js',
  '/vendor/csso.js',
  '/vendor/html-minifier.js',
  '/vendor/instant-page.js',
  '/vendor/iro.js',
  '/vendor/prettier-babel.js',
  '/vendor/prettier-estree.js',
  '/vendor/prettier-html.js',
  '/vendor/prettier-postcss.js',
  '/vendor/prettier.js',
  '/vendor/terser.js',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_KEY).then(cache => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_KEY).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  const isLocal = url.origin === self.location.origin;

  if (isLocal) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_KEY).then(cache => cache.put(request, clone));
          }
          return response;
        });
      })
    );
  } else {
    // Network-first for external assets, serve from cache when offline.
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_KEY).then(cache => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
  }
});
