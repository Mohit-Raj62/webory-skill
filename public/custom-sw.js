// Custom Service Worker Logic for Push Notifications
self.addEventListener('push', function(event) {
  if (event.data) {
    try {
      const data = event.data.json();
      const baseUrl = self.location.origin;
      const options = {
        body: data.body || 'New message from Webory Skills',
        icon: data.icon || `${baseUrl}/icons/icon-192x192.png`,
        badge: data.badge || `${baseUrl}/favicon.png`,
        timestamp: Date.now(),
        data: {
          url: data.url || baseUrl
        },
        vibrate: [100, 50, 100],
        tag: 'webory-broadcast',
        renotify: true,
        requireInteraction: true,
        actions: [
          { action: 'open', title: 'Open App' }
        ]
      };
      event.waitUntil(
        self.registration.showNotification(data.title || 'Webory Skills', options)
      );
    } catch (e) {
      console.error('Push error:', e);
      event.waitUntil(
        self.registration.showNotification('Webory Skills', {
          body: event.data.text(),
          icon: '/icons/icon-192x192.png'
        })
      );
    }
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  const targetUrl = event.notification.data.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      // 1. Try to find a window that's already on the target URL
      for (let i = 0; i < windowClients.length; i++) {
        let client = windowClients[i];
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      
      // 2. Try to find any window from our app and navigate it
      if (windowClients.length > 0) {
        let client = windowClients[0];
        if ('focus' in client) {
          client.focus();
          if ('navigate' in client) {
            return client.navigate(targetUrl);
          }
        }
      }

      // 3. Otherwise, open a new window (OS should open PWA if installed)
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
