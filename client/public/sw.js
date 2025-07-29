// Simple service worker for PWA functionality
self.addEventListener('install', event => {
  console.log('Service worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Service worker activated');
  event.waitUntil(self.clients.claim());
});

// Basic fetch handler - no caching to avoid issues
self.addEventListener('fetch', event => {
  // Just pass through to network
  event.respondWith(fetch(event.request));
});