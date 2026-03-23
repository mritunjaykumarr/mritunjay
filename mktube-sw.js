/* ═══════════════════════════════════════════
   MKTube Service Worker
   Keeps the page alive for background audio
═══════════════════════════════════════════ */
const CACHE = 'mktube-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(cache =>
      cache.addAll(['/adfree.html'])
    ).catch(() => {})
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', e => {
  // Only cache same-origin requests
  if (e.request.url.startsWith(self.location.origin)) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
  }
});

// Keep alive ping — prevents browser from suspending the SW
self.addEventListener('message', e => {
  if (e.data === 'keepalive') {
    e.ports[0]?.postMessage('alive');
  }
});
