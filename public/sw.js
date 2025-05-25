// sw.js - Custom Service Worker with Push Notifications
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

// Configure Workbox
workbox.setConfig({
  debug: false, // Set to true for development
});

// Precaching
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

// ====================
// Push Notifications
// ====================
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  
  const title = data.title || 'New Notification';
  const options = {
    body: data.body || 'You have a new message',
    icon: data.icon || '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    data: {
      url: data.url || '/',
      ...(data.data || {})
    },
    vibrate: [200, 100, 200]
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      // Check for existing tab
      for (const client of windowClients) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Open new tab if none found
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// ====================
// Advanced Caching Strategies
// ====================
// API Requests (Network First)
workbox.routing.registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new workbox.strategies.NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60 // 5 minutes
      })
    ]
  })
);

// Static Assets (Cache First)
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'style' || 
                 request.destination === 'script' ||
                 request.destination === 'image',
  new workbox.strategies.CacheFirst({
    cacheName: 'static-assets',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
      })
    ]
  })
);

// Navigation Fallback (Network Only)
workbox.routing.registerRoute(
  ({ request }) => request.mode === 'navigate',
  new workbox.strategies.NetworkOnly()
);

// ====================
// Installation & Activation
// ====================
self.addEventListener('install', (event) => {
  self.skipWaiting();
  console.log('Service Worker installed');
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
  console.log('Service Worker activated');
});
