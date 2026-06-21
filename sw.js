const CACHE_KEY = 'tools-4573dea1';

const PRECACHE = [
  '/base64.html',
  '/colors.html',
  '/copy.js',
  '/cron.html',
  '/fonts.html',
  '/fonts.json',
  '/formatter.html',
  '/hash.html',
  '/iconic.html',
  '/index.html',
  '/keycodes.html',
  '/main.css',
  '/markdown.html',
  '/offline.js',
  '/package.json',
  '/palette.html',
  '/preview.html',
  '/remove.html',
  '/translate.html',
  '/uuid.html',
  '/vendor/cronstrue.js',
  '/vendor/csso.js',
  '/vendor/html-minifier.js',
  '/vendor/instant-page.js',
  '/vendor/iro.js',
  '/vendor/marked.js',
  '/vendor/models/Xenova/opus-mt-en-nl/config.json',
  '/vendor/models/Xenova/opus-mt-en-nl/onnx/decoder_model_merged_quantized.onnx',
  '/vendor/models/Xenova/opus-mt-en-nl/onnx/encoder_model_quantized.onnx',
  '/vendor/models/Xenova/opus-mt-en-nl/tokenizer.json',
  '/vendor/models/Xenova/opus-mt-en-nl/tokenizer_config.json',
  '/vendor/models/Xenova/opus-mt-nl-en/config.json',
  '/vendor/models/Xenova/opus-mt-nl-en/onnx/decoder_model_merged_quantized.onnx',
  '/vendor/models/Xenova/opus-mt-nl-en/onnx/encoder_model_quantized.onnx',
  '/vendor/models/Xenova/opus-mt-nl-en/tokenizer.json',
  '/vendor/models/Xenova/opus-mt-nl-en/tokenizer_config.json',
  '/vendor/models/briaai/RMBG-1.4/config.json',
  '/vendor/models/briaai/RMBG-1.4/onnx/model_quantized.onnx',
  '/vendor/models/briaai/RMBG-1.4/preprocessor_config.json',
  '/vendor/ort-wasm-simd-threaded.jsep.mjs',
  '/vendor/ort-wasm-simd-threaded.jsep.wasm',
  '/vendor/prettier-babel.js',
  '/vendor/prettier-estree.js',
  '/vendor/prettier-html.js',
  '/vendor/prettier-postcss.js',
  '/vendor/prettier.js',
  '/vendor/terser.js',
  '/vendor/transformers.js',
  '/vendor/uuid/esm-browser/index.js',
  '/vendor/uuid/esm-browser/max.js',
  '/vendor/uuid/esm-browser/md5.js',
  '/vendor/uuid/esm-browser/native.js',
  '/vendor/uuid/esm-browser/nil.js',
  '/vendor/uuid/esm-browser/parse.js',
  '/vendor/uuid/esm-browser/regex.js',
  '/vendor/uuid/esm-browser/rng.js',
  '/vendor/uuid/esm-browser/sha1.js',
  '/vendor/uuid/esm-browser/stringify.js',
  '/vendor/uuid/esm-browser/v1.js',
  '/vendor/uuid/esm-browser/v1ToV6.js',
  '/vendor/uuid/esm-browser/v3.js',
  '/vendor/uuid/esm-browser/v35.js',
  '/vendor/uuid/esm-browser/v4.js',
  '/vendor/uuid/esm-browser/v5.js',
  '/vendor/uuid/esm-browser/v6.js',
  '/vendor/uuid/esm-browser/v6ToV1.js',
  '/vendor/uuid/esm-browser/v7.js',
  '/vendor/uuid/esm-browser/validate.js',
  '/vendor/uuid/esm-browser/version.js',
  '/vendor/uuid/index.js',
  '/vendor/uuid/max.js',
  '/vendor/uuid/md5.js',
  '/vendor/uuid/native.js',
  '/vendor/uuid/nil.js',
  '/vendor/uuid/parse.js',
  '/vendor/uuid/regex.js',
  '/vendor/uuid/rng.js',
  '/vendor/uuid/sha1.js',
  '/vendor/uuid/stringify.js',
  '/vendor/uuid/v1.js',
  '/vendor/uuid/v1ToV6.js',
  '/vendor/uuid/v3.js',
  '/vendor/uuid/v35.js',
  '/vendor/uuid/v4.js',
  '/vendor/uuid/v5.js',
  '/vendor/uuid/v6.js',
  '/vendor/uuid/v6ToV1.js',
  '/vendor/uuid/v7.js',
  '/vendor/uuid/validate.js',
  '/vendor/uuid/version.js',
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
