/**
 * Sree Krushna Marriage OS — Progressive Web App Service Worker (v1.0.0)
 * Strategy: Stale-While-Revalidate for UI shell; Network-First for Auth & Dynamic APIs.
 */

const CACHE_NAME = 'sree-krushna-os-v4.1.0';
const STATIC_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/main.css',
  '/css/dopkos-engine.css',
  '/js/config.js',
  '/js/theme-init.js',
  '/js/auth.js',
  '/js/marriage-state.js',
  '/js/modules/console-drawer.js',
  '/js/modules/threads-engine.js',
  '/js/modules/intake-engine.js',
  '/js/modules/dopkos-engine.js',
  '/js/app.js'
];

// Install Event: Cache Core Shell Assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_SHELL);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: Cleanup Stale Caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Stale-While-Revalidate with Network Fallback
self.addEventListener('fetch', (event) => {
  // Always bypass cache in local development
  if (self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1') {
    return;
  }

  // Do not cache Firebase auth / Identity Toolkit / Google APIs
  if (
    event.request.url.includes('identitytoolkit.googleapis.com') ||
    event.request.url.includes('securetoken.googleapis.com') ||
    event.request.url.includes('apis.google.com') ||
    event.request.url.includes('accounts.google.com')
  ) {
    return;
  }

  // Handle Static & App Shell GET Requests
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
  }
});
