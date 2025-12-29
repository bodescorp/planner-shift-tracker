// Service Worker para PWA
const CACHE_NAME = 'cronograma-v2';
const urlsToCache = [
  './',
  './index.html',
  './src/css/style.css',
  './src/js/app.js',
  './manifest.json',
  './src/assets/icon-192.svg',
  './src/assets/icon-512.svg',
  './src/assets/ornn.glb'
];

// Instalar Service Worker e cachear recursos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return Promise.all(
          urlsToCache.map(url => {
            return cache.add(url).catch(err => {
              console.error('Falha ao cachear:', url, err);
              throw err;
            });
          })
        );
      })
  );
  self.skipWaiting();
});

// Ativar Service Worker e limpar caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptar requisições e servir do cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
