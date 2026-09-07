const CACHE_NAME = 'pwa-iframe-cache-v2';

// Senarai fail yang perlu disimpan secara luar talian (offline)
// Nota: Kita tidak boleh cache kandungan dalam iframe secara langsung,
// kita hanya cache fail pembungkus PWA ini.
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
        console.log('Cache dibuka');
        return cache.addAll(urlsToCache);
      })
  );
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
});

// Peristiwa 'Fetch': Berikan tindak balas dari cache jika ada, jika tidak guna rangkaian
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Kembalikan response dari cache jika wujud
        if (response) {
          return response;
        }
        // Jika tidak wujud di cache, ambil dari internet
        return fetch(event.request);
      })
  );
});
