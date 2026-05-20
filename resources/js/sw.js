import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute, NavigationRoute, setCatchHandler } from 'workbox-routing';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate, NetworkOnly } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

precacheAndRoute(self.__WB_MANIFEST);

const OFFLINE_CACHE = 'offline-fallback-v1';

self.addEventListener('install', event => {
  event.waitUntil(caches.open(OFFLINE_CACHE).then(cache => cache.addAll(['/offline.html', '/icons/192.png'])));
});

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
  ({ url }) => /\.(js|css|woff2?|ttf|eot)$/.test(url.pathname),
  new StaleWhileRevalidate({ cacheName: 'static-assets', plugins: [new ExpirationPlugin({ maxEntries: 80, maxAgeSeconds: 30 * 86400 })] })
);

registerRoute(
  ({ url, request }) => url.pathname.startsWith('/yazi/') && request.headers.get('X-Inertia') !== 'true',
  new NetworkFirst({ cacheName: 'posts', networkTimeoutSeconds: 3, plugins: [new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 7 * 86400 })] })
);

registerRoute(
  ({ url, request }) => (url.pathname === '/' || url.pathname.startsWith('/yazilar') || url.pathname.startsWith('/haberler')) && request.headers.get('X-Inertia') !== 'true',
  new NetworkFirst({ cacheName: 'pages', networkTimeoutSeconds: 3, plugins: [new ExpirationPlugin({ maxEntries: 20, maxAgeSeconds: 86400 })] })
);

registerRoute(
  ({ url }) => url.pathname.startsWith('/admin') || url.pathname.startsWith('/api/quick-log') || url.pathname.startsWith('/api/push') || url.pathname.startsWith('/api/letterboxd'),
  new NetworkOnly()
);

registerRoute(
  ({ request }) => request.headers.get('X-Inertia') === 'true',
  new NetworkOnly()
);

setCatchHandler(async ({ event }) => {
  if (event.request.destination === 'document') {
    return caches.match('/offline.html');
  }
  return Response.error();
});

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
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});

self.addEventListener('message', event => { if (event.data?.type === 'SKIP_WAITING') self.skipWaiting(); });
