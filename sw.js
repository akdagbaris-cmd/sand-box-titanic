/* Sand Box Titanic - offline cache.
   Serves the game from the cache so it opens with no internet, and quietly
   refreshes itself in the background. A new version shows up next launch. */
const CACHE = 'sbt-2';
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
  './icons/apple-touch-icon.png',
  './assets/models/anims.glb',
  './assets/models/c/cap.glb',
  './assets/models/c/chef.glb',
  './assets/models/c/eng.glb',
  './assets/models/c/fa1.glb',
  './assets/models/c/fa14.glb',
  './assets/models/c/fa2.glb',
  './assets/models/c/fa5.glb',
  './assets/models/c/fb3.glb',
  './assets/models/c/fish.glb',
  './assets/models/c/kb1.glb',
  './assets/models/c/kb2.glb',
  './assets/models/c/kg1.glb',
  './assets/models/c/kg2.glb',
  './assets/models/c/ma1.glb',
  './assets/models/c/ma14.glb',
  './assets/models/c/ma6.glb',
  './assets/models/c/mb1.glb',
  './assets/models/c/mb6.glb',
  './assets/models/c/off.glb',
  './assets/models/c/offf.glb',
  './assets/models/c/sol.glb',
  './assets/models/c/solf.glb',
  './assets/models/f/ChairDamaskPurplegold.glb',
  './assets/models/f/DiffuseTransmissionPlant.glb',
  './assets/models/f/GlamVelvetSofa.glb',
  './assets/models/f/SheenWoodLeatherSofa.glb',
  './assets/models/t/FloorsCheckerboard_S_Diffuse.jpg',
  './assets/models/t/hardwood2_bump.jpg',
  './assets/models/t/hardwood2_diffuse.jpg',
  './assets/models/t/hardwood2_roughness.jpg'
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
