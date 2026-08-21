const CACHE = 'cryptoworld-v2-curriculum';
const ASSETS = ['.', 'index.html', 'manifest.json', 'css/style.css',
  'js/i18n.js', 'js/curriculum.js', 'js/ciphers.js', 'js/audio.js', 'js/controls.js',
  'js/text3d.js', 'js/world.js', 'js/act/caesar.js', 'js/act/railfence.js',
  'js/act/enigma.js', 'js/act/aes.js', 'js/act/rsha.js', 'js/act/quantum.js', 'js/act/curriculum.js',
  'js/main.js', 'lib/three.min.js',
  'icons/icon-192.png', 'icons/icon-512.png'];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then((hit) => {
      if (hit) return hit;
      return fetch(e.request).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
        return res;
      }).catch(() => caches.match('index.html'));
    })
  );
});