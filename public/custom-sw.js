// Custom Service Worker - v2.3
console.log('PWA: custom-sw.js v2.3 loaded');

self.addEventListener('push', function(event) {
  console.log('PWA: Push event received');
  if (event.data) {
    try {
      const data = event.data.json();
      console.log('PWA: Push data:', data);
      
      const options = {
        body: data.body || 'New message from Webory Skills',
        icon: data.icon || '/icons/icon-192x192.png',
        badge: '/favicon.png', // Try simple badge
        timestamp: Date.now(),
        data: {
          url: data.url || '/'
        },
        vibrate: [200, 100, 200],
        tag: 'webory-broadcast',
        renotify: true,
        requireInteraction: true,
        actions: [
          { action: 'open', title: 'Open Webory App' }
        ]
      };
      
      event.waitUntil(
        self.registration.showNotification(data.title || 'Webory Skills', options)
      );
    } catch (e) {
      console.error('PWA: Push error:', e);
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
  console.log('PWA: Notification clicked');
  event.notification.close();

  const baseUrl = self.location.origin;
  const targetPath = event.notification.data.url || '/';
  const targetUrl = new URL(targetPath, baseUrl).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      // 1. Try to find any existing window of our app
      for (const client of windowClients) {
        if (client.url.startsWith(baseUrl) && 'focus' in client) {
          console.log('PWA: Found app window, focusing and navigating');
          client.focus();
          if (client.url !== targetUrl && 'navigate' in client) {
            return client.navigate(targetUrl);
          }
          return;
        }
      }
      
      // 2. If no window is open, open a new one (OS should handle PWA redirect)
      if (clients.openWindow) {
        console.log('PWA: Opening new window');
        return clients.openWindow(targetUrl);
      }
    })
  );
});
