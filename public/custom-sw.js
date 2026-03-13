// Custom Service Worker Logic for Push Notifications
self.addEventListener('push', function(event) {
  if (event.data) {
    try {
      const data = event.data.json();
      const options = {
        body: data.body || 'New message from Webory Skills',
        icon: data.icon || '/icons/icon-192x192.png',
        badge: data.badge || '/favicon.png',
        timestamp: Date.now(),
        data: {
          url: data.url || '/'
        },
        vibrate: [100, 50, 100],
        tag: 'webory-broadcast',
        renotify: true,
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
          body: event.data.text()
        })
      );
    }
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      const url = event.notification.data.url || '/';
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
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
