import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate, NetworkOnly } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ url }) => url.hostname === 'image.tmdb.org',
  new CacheFirst({
    cacheName: 'tmdb-images',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 30 * 24 * 60 * 60 }),
    ],
  })
);

registerRoute(
  ({ url }) => url.pathname.startsWith('/api/tmdb/search'),
  new StaleWhileRevalidate({ cacheName: 'tmdb-search', plugins: [new ExpirationPlugin({ maxAgeSeconds: 86400 })] })
);

registerRoute(
  ({ url, request }) => url.pathname.startsWith('/yazi/') && request.headers.get('X-Inertia') !== 'true',
  new NetworkFirst({ cacheName: 'posts', networkTimeoutSeconds: 3, plugins: [new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 7 * 86400 })] })
);

registerRoute(
  ({ url }) => url.pathname.startsWith('/admin') || url.pathname.startsWith('/api/quick-log') || url.pathname.startsWith('/api/push') || url.pathname.startsWith('/api/letterboxd'),
  new NetworkOnly()
);

registerRoute(
  ({ request }) => request.headers.get('X-Inertia') === 'true',
  new NetworkOnly()
);

self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(self.registration.showNotification(data.title || 'Ben/İzledim', {
    body: data.body || '',
    icon: '/icons/192.png',
    badge: '/icons/badge.png',
    data: { url: data.url || '/' },
    tag: data.tag || undefined,
  }));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});

self.addEventListener('message', event => { if (event.data?.type === 'SKIP_WAITING') self.skipWaiting(); });
