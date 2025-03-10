const CACHE_NAME = 'pwa-image-app-cache-v1';
const urlsToCache = ['/', '/index.html'];

self.addEventListener('install', (event) => {
	console.log('1')
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
	console.log('2')
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});