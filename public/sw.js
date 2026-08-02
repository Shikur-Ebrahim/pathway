const CACHE_NAME = 'pathway-v2';

// Must include start_url ("/") for Chrome to consider app installable
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/apple-touch-icon.png',
  '/logo.png',
  '/default-avatar.jpg',
];

// Install: pre-cache critical assets including start_url "/"
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(STATIC_ASSETS)
    ).then(() => self.skipWaiting())
  );
});

// Activate: clean old caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      ),
      self.clients.claim(),
    ])
  );
});

// Fetch: network-first, fall back to cache for same-origin requests
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Cache static assets
        if (
          networkResponse.ok &&
          (url.pathname === '/' ||
            url.pathname.startsWith('/icons/') ||
            url.pathname === '/manifest.json' ||
            url.pathname === '/logo.png' ||
            url.pathname === '/default-avatar.jpg')
        ) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      })
      .catch(() =>
        // Serve from cache if offline
        caches.match(event.request).then(
          (cached) => cached || new Response('Offline', { status: 503, statusText: 'Service Unavailable' })
        )
      )
  );
});
