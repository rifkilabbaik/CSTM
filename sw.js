const CACHE_NAME = "takbiran-v2";
const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./manifest.json",
    "./icons/icon-152.png",
    "./icons/icon-512.png"
];

// Install
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(FILES_TO_CACHE))
    );
    self.skipWaiting();
});

// Activate — hapus cache lama
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            )
        )
    );
    self.clients.claim();
});

// Fetch — Network-first untuk HTML, Cache-first untuk asset lain
self.addEventListener("fetch", event => {
    const req = event.request;
    const url = new URL(req.url);

    // Untuk navigasi (index.html, dokumen) → network dulu, fallback ke cache
    if (req.mode === "navigate" || req.destination === "document" || url.pathname.endsWith(".html")) {
        event.respondWith(
            fetch(req)
                .then(response => {
                    // Update cache dengan versi baru
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
                    return response;
                })
                .catch(() => caches.match(req).then(r => r || caches.match("./index.html")))
        );
        return;
    }

    // Asset statis (icon, manifest, dll) → cache dulu, fallback network, lalu update cache di background
    event.respondWith(
        caches.match(req).then(cached => {
            const networkFetch = fetch(req).then(response => {
                if (response && response.status === 200) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
                }
                return response;
            }).catch(() => cached);
            return cached || networkFetch;
        })
    );
});

// Listener untuk pesan dari client (misal trigger skipWaiting manual)
self.addEventListener("message", event => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});
