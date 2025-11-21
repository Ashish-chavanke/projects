// ==============================
// Zerolock Service Worker
// Optimized & Original Version
// ==============================

const ZL_VERSION = "zerolock-v1";
const ZL_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./assets/favicon.jpg",
];

// Install: Cache core assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(ZL_VERSION).then((cache) => {
      return cache.addAll(ZL_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: Remove old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== ZL_VERSION)
          .map((oldKey) => caches.delete(oldKey))
      );
    })
  );
  self.clients.claim();
});

// Fetch: Network first → fallback to cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Save fresh copy to cache
        const clone = response.clone();
        caches.open(ZL_VERSION).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request)) // offline fallback
  );
});
