/* eslint-disable no-restricted-globals */
/**
 * Service Worker for Daily Adhkar
 * Enables mobile-safe notifications via ServiceWorkerRegistration.showNotification()
 * (required by Android Chrome, Samsung Internet, Firefox Mobile, and iOS standalone PWAs
 * which block the `new Notification()` constructor on the main thread).
 */

const SW_VERSION = 'adhkar-sw-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || typeof data !== 'object') return;

  if (data.type === 'SHOW_NOTIFICATION' && self.registration && self.registration.showNotification) {
    const title = data.title || 'Daily Adhkar';
    const options = {
      body: data.body || 'രാവിലെത്തെ ദിക്റുകൾ ചൊല്ലാൻ സമയമായി 🌅',
      icon: data.icon || 'icon.png',
      badge: 'icon.png',
      tag: data.tag || 'daily-adhkar-reminder',
      renotify: true,
      vibrate: [180, 80, 180],
      data: {
        tab: data.targetTab || 'morning',
        url: data.url || '/',
      },
    };

    event.waitUntil(
      self.registration.showNotification(title, options).catch(() => {
        // Ignore if OS permission not granted
      })
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetTab = (event.notification.data && event.notification.data.tab) || 'morning';
  const targetUrl = `/?tab=${encodeURIComponent(targetTab)}`;

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ('focus' in client) {
            client.postMessage({
              type: 'ADHKAR_NOTIFICATION_CLICK',
              tab: targetTab,
            });
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
        return undefined;
      })
  );
});
