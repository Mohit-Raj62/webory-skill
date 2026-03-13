// Custom Service Worker - v2.2
console.log('PWA: custom-sw.js v2.2 loaded');

// Helper to normalize URLs for comparison
function normalizeUrl(url) {
  return new URL(url, self.location.origin).href.replace(/\/$/, "");
}

self.addEventListener('push', function(event) {
  console.log('PWA: Push event received');
  if (event.data) {
    try {
      const data = event.data.json();
      console.log('PWA: Push data:', data);
      const baseUrl = self.location.origin;
      
      const options = {
        body: data.body || 'New message from Webory Skills',
        icon: data.icon || `${baseUrl}/icons/icon-512x512.png`,
        badge: data.badge || `${baseUrl}/favicon.png`,
        timestamp: Date.now(),
        data: {
          url: data.url || baseUrl
        },
        vibrate: [200, 100, 200],
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
          icon: '/icons/icon-512x512.png'
        })
      );
    }
  }
});

self.addEventListener('notificationclick', function(event) {
  console.log('PWA: Notification clicked', event.action);
  event.notification.close();

  const baseUrl = self.location.origin;
  let targetUrl = baseUrl;
  if (event.notification.data && event.notification.data.url) {
    targetUrl = event.notification.data.url;
  }

  const normalizedTarget = normalizeUrl(targetUrl);

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      console.log('PWA: Open clients found:', windowClients.length);
      
      // 1. Try to find a window that matches the target URL exactly
      for (const client of windowClients) {
        if (normalizeUrl(client.url) === normalizedTarget && 'focus' in client) {
          console.log('PWA: Focusing exact match:', client.url);
          return client.focus();
        }
      }
      
      // 2. Otherwise, find any window for our app and navigate it
      for (const client of windowClients) {
        if (client.url.startsWith(baseUrl) && 'focus' in client) {
          console.log('PWA: Focusing app window and navigating:', client.url);
          client.focus();
          if ('navigate' in client) {
            return client.navigate(targetUrl);
          }
          return;
        }
      }
      
      // 3. If no window is open, open a new one
      if (clients.openWindow) {
        console.log('PWA: Opening new window for:', targetUrl);
        return clients.openWindow(targetUrl);
      }
    })
  );
});
