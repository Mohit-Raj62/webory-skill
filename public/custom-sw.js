// Custom Service Worker - v2.1
console.log('PWA: custom-sw.js v2.1 loaded');

self.addEventListener('push', function(event) {
  console.log('PWA: Push event received');
  if (event.data) {
    try {
      const data = event.data.json();
      console.log('PWA: Push data:', data);
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
      console.error('PWA: Push JSON error:', e);
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
  console.log('PWA: Notification clicked', event.action);
  event.notification.close();

  // Try to get URL from notification data, fallback to origin
  const baseUrl = self.location.origin;
  let targetUrl = baseUrl;
  if (event.notification.data && event.notification.data.url) {
    targetUrl = event.notification.data.url;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      console.log('PWA: Open clients found:', windowClients.length);
      
      // 1. If any window is already open, focus it
      for (let i = 0; i < windowClients.length; i++) {
        let client = windowClients[i];
        // Check if this client is our app (we check for protocol/host match)
        if (client.url.startsWith(baseUrl) && 'focus' in client) {
          console.log('PWA: Focusing existing window:', client.url);
          client.focus();
          if (client.url !== targetUrl && 'navigate' in client) {
              return client.navigate(targetUrl);
          }
          return;
        }
      }
      
      // 2. If no window is open, open a new one (standalone app if installed)
      if (clients.openWindow) {
        console.log('PWA: Opening new window for:', targetUrl);
        return clients.openWindow(targetUrl);
      }
    })
  );
});
