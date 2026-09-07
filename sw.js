// Tukar ke v3 untuk paksa pelayar web kemaskini fail baru
const CACHE_NAME = 'pwa-iframe-cache-v3';

// Senarai fail yang perlu disimpan secara luar talian (offline)
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-512.png'
];

// Peristiwa 'Install': Simpan fail ke dalam cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache dibuka untuk v3');
        return cache.addAll(urlsToCache);
      })
  );
  // Paksa service worker baru untuk terus aktif
  self.skipWaiting();
});

// Peristiwa 'Activate': Buang cache lama jika versi berubah
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Membuang cache lama:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Kawal terus semua tab yang terbuka
  event.waitUntil(self.clients.claim());
});

// Peristiwa 'Fetch': Berikan tindak balas dari cache jika ada, jika tidak guna rangkaian
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
