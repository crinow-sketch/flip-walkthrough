const CACHE_NAME = 'flip-walk-v9';
const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './js/costs.js',
  './js/walkthrough.js',
  './js/storage.js',
  './js/export.js',
  './lib/jspdf.umd.min.js',
  './manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first: always try to fetch latest, fall back to cache offline
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(r => {
        const clone = r.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        return r;
      })
      .catch(() => caches.match(e.request))
  );
});
