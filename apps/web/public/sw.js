// ============================================================
// KisanSeva Service Worker — Workbox-based caching strategy
// ============================================================

const CACHE_VERSION = 'v1.0.0'
const STATIC_CACHE  = `kisanseva-static-${CACHE_VERSION}`
const DYNAMIC_CACHE = `kisanseva-dynamic-${CACHE_VERSION}`
const OFFLINE_CACHE = `kisanseva-offline-${CACHE_VERSION}`

const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
]

// HTML pages to always serve network-first (never cache-first)
// so crawlers always get fresh content and users get live data
const NETWORK_FIRST_PATHS = [
  '/api/',
  '/market',
  '/schedule',
  '/diagnose',
]

// ─── Install ──────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

// ─── Activate ─────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== STATIC_CACHE && k !== DYNAMIC_CACHE && k !== OFFLINE_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  )
  self.clients.claim()
})

// ─── Fetch Strategy ───────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET, chrome-extension, and non-http requests
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) return

  // ── HTML documents: Network-first (critical for SEO + freshness)
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirstWithOfflineFallback(request))
    return
  }

  // ── API calls: Network-first with stale-while-revalidate for price/weather
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE, 15 * 60))
    return
  }

  // ── Static assets: Cache-first
  if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'font' ||
    request.destination === 'image' ||
    url.pathname.startsWith('/_next/static/')
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE))
    return
  }

  // Default: stale-while-revalidate
  event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE, 60 * 60))
})

// ─── Background Sync ──────────────────────────────────────
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-diagnoses') {
    event.waitUntil(syncOfflineData('pending-diagnoses'))
  }
  if (event.tag === 'sync-feedback') {
    event.waitUntil(syncOfflineData('pending-feedback'))
  }
})

// ─── Push Notifications ───────────────────────────────────
self.addEventListener('push', (event) => {
  if (!event.data) return
  const data = event.data.json()
  event.waitUntil(
    self.registration.showNotification(data.title || 'KisanSeva Alert', {
      body: data.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/badge-72.png',
      tag: data.tag || 'general',
      data: { url: data.url || '/dashboard' },
      actions: [
        { action: 'view', title: 'View Advisory' },
        { action: 'dismiss', title: 'Dismiss' }
      ]
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  if (event.action !== 'dismiss') {
    const url = event.notification.data?.url || '/dashboard'
    event.waitUntil(clients.openWindow(url))
  }
})

// ─── Helpers ──────────────────────────────────────────────
async function networkFirstWithOfflineFallback(request) {
  try {
    const response = await fetch(request)
    const cache = await caches.open(DYNAMIC_CACHE)
    cache.put(request, response.clone())
    return response
  } catch {
    const cached = await caches.match(request)
    if (cached) return cached
    return caches.match('/offline')
  }
}

async function staleWhileRevalidate(request, cacheName, maxAge) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)

  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) cache.put(request, response.clone())
    return response
  }).catch(() => cached)

  if (cached) {
    const cacheDate = new Date(cached.headers.get('date') || 0)
    const age = (Date.now() - cacheDate.getTime()) / 1000
    if (age < maxAge) return cached
  }

  return fetchPromise
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  if (cached) return cached

  const response = await fetch(request)
  if (response.ok) cache.put(request, response.clone())
  return response
}

async function syncOfflineData(storeName) {
  // In production: read from IndexedDB and POST to API
  console.log(`[SW] Syncing ${storeName}...`)
}
