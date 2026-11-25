/* Sand Box Titanic - offline cache.
   Serves the game from the cache so it opens with no internet, and quietly
   refreshes itself in the background. A new version shows up next launch. */
const CACHE = 'sbt-1';
const CORE = [
  './',
  './index.html',
  './futuristic.html',
  './manifest.webmanifest',
  './assets/three.min.js',
  './assets/fonts.css',
  './assets/fonts/alfa-slab-one-latin-400-normal.woff2',
  './assets/fonts/alfa-slab-one-latin-ext-400-normal.woff2',
  './assets/fonts/nunito-latin-600-normal.woff2',
  './assets/fonts/nunito-latin-800-normal.woff2',
  './assets/fonts/nunito-latin-900-normal.woff2',
  './assets/fonts/nunito-latin-ext-600-normal.woff2',
  './assets/fonts/nunito-latin-ext-800-normal.woff2',
  './assets/fonts/nunito-latin-ext-900-normal.woff2',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    // one bad URL must not fail the whole install
    await Promise.all(CORE.map(u => c.add(new Request(u, { cache: 'reload' })).catch(() => {})));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req, { ignoreSearch: true });

    // Conditional request: the server answers 304 when nothing changed,
    // so refreshing costs almost no data even for the big game file.
    const fresh = fetch(req, { cache: 'no-cache' }).then(res => {
      if (res && res.ok && res.type === 'basic') cache.put(req, res.clone()).catch(() => {});
      return res;
    }).catch(() => null);

    if (hit) { e.waitUntil(fresh); return hit; }

    const res = await fresh;
    if (res) return res;
    const fallback = await cache.match('./index.html', { ignoreSearch: true });
    if (fallback && req.mode === 'navigate') return fallback;
    return new Response('Offline', { status: 503, statusText: 'Offline' });
  })());
});
