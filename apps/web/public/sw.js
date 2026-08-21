self.addEventListener('install', function(e) {
  // Take over the page immediately
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    // 1. Unregister the service worker
    self.registration.unregister()
      .then(function() {
        // 2. Clear all caches created by this or previous service workers
        return caches.keys().then(function(keys) {
          return Promise.all(
            keys.map(function(key) {
              return caches.delete(key);
            })
          );
        });
      })
      .then(function() {
        // 3. Force all clients (browser tabs) to reload without cache
        return self.clients.matchAll({ type: 'window' }).then(function(windowClients) {
          for (var i = 0; i < windowClients.length; i++) {
            var client = windowClients[i];
            client.navigate(client.url);
          }
        });
      })
  );
});
