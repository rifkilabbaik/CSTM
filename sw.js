// Service worker Takbiran.
// Naikkan CACHE_VERSION setiap kali aset di PRECACHE berubah.
const CACHE_VERSION = 'v2';
const CACHE_NAME = `takbiran-${CACHE_VERSION}`;

const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/app.css',
  './js/data.js',
  './js/app.js',
  './js/export.js',
];

self.addEventListener('install', event => {
  event.waitUntil(
    // addAll gagal total kalau satu aset 404, jadi cache satu per satu.
    caches.open(CACHE_NAME).then(cache =>
      Promise.all(PRECACHE.map(url => cache.add(url).catch(() => null)))
    )
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// index.html mengirim pesan ini saat versi baru siap dipasang.
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // Library dari CDN: cache-first supaya export tetap jalan saat offline.
  const isCdn = url.origin !== self.location.origin;

  if (req.mode === 'navigate') {
    // Halaman: network-first agar update cepat terlihat, fallback ke cache saat offline.
    event.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        // Jangan cache respons error; respons opaque dari CDN tetap berguna.
        if (res && (res.ok || (isCdn && res.type === 'opaque'))) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => cached);
    })
  );
});
