// KisanSeva SW Killer v3 — wipes all caches, unregisters self, force-reloads
const CACHE_BUST_KEY = 'ks_cache_killed_v3';

self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    (async function() {
      // Delete ALL caches
      const cacheKeys = await caches.keys();
      await Promise.all(cacheKeys.map(key => caches.delete(key)));

      // Claim all open clients before we unregister
      await self.clients.claim();

      const allClients = await self.clients.matchAll({ includeUncontrolled: true });

      // Unregister self
      await self.registration.unregister();

      // Tell every open tab to do a hard reload
      for (const client of allClients) {
        client.postMessage({ type: 'SW_KILLED' });
      }
    })()
  );
});

// Do not intercept any fetches — pass everything through to the network
self.addEventListener('fetch', function(event) {
  event.respondWith(fetch(event.request));
});
