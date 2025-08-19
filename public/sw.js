const CACHE_NAME = 'searchyourtour-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/main.css',
  '/assets/main.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Her URL'yi ayrı ayrı ekle ve hataları yakala
        return Promise.allSettled(
          urlsToCache.map(url => 
            cache.add(url).catch(err => {
              console.warn('Failed to cache:', url, err);
              return null;
            })
          )
        );
      })
      .catch(err => {
        console.error('Cache installation failed:', err);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
      .catch(err => {
        console.error('Fetch failed:', err);
        // Fallback response
        return new Response('Network error', { status: 503 });
      })
  );
}); 