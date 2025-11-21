const ZL_VERSION = "zerolock-v1";
const ZL_ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./as.js",
  "./manifest.webmanifest",
  "./assets/f.jpg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(ZL_VERSION).then((cache) => {
      return cache.addAll(ZL_ASSETS);
    })
  );
  self.skipWaiting();
});

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

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {

        const clone = response.clone();
        caches.open(ZL_VERSION).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
