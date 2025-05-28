// sw.js - Custom Service Worker for Push Notifications Only

// Handle Push Events
self.addEventListener('push', event => {
  if (!event.data) {
    console.log('Push event but no data');
    return;
  }

  const payload = event.data.json()
  const { body, icon, image, badge, url, title } = payload;
  const notificationTitle = title ?? "Unknown title";
   const notificationOptions = {
        body,
        icon,
        image,
        data: {
            url,
        },
        badge,
  };
  event.waitUntil(
        self.registration.showNotification(notificationTitle, notificationOptions).then(() => {
            sendDeliveryReportAction();
        })
    );
    


  // event.waitUntil(
  //   (async () => {
  //     const data = await event.data.json();
  //     console.log('Push event received:', data);

  //     const title = data.title || 'New Notification';
  //     const options = {
  //       body: data.body || 'You have a new message.',
  //       icon: data.icon || '/icon-192x192.png',
  //       badge: data.badge || '/icon-192x192.png',
  //       data: {
  //         url: data.url || '/',
  //         ...(data.data || {})
  //       },
  //       vibrate: [200, 100, 200]
  //     };

  //     self.registration.showNotification(title, options);
  //   })()
  // );
});
// Handle Notification Clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (const client of windowClients) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
