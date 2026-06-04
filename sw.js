const CACHE_NAME = "time-free-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css?v=time-free-memes",
  "./app.js?v=time-free-memes",
  "./manifest.webmanifest",
  "./assets/time-free-icon.svg",
  "./assets/estonia-evening-clock.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys
        .filter((key) => key !== CACHE_NAME)
        .map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
