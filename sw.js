const CACHE = 'kamilly-v2';
const ASSETS = ['/', '/index.html', '/app.js', '/manifest.json', '/icons/hello-kitty.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

let scheduledTimer = null;

self.addEventListener('message', e => {
  if (e.data?.type !== 'SCHEDULE') return;
  if (scheduledTimer) clearTimeout(scheduledTimer);
  const { delay, message } = e.data;
  scheduledTimer = setTimeout(() => {
    self.registration.showNotification('lembrete', {
      body: message.text,
      icon: '/icons/hello-kitty.png',
      badge: '/icons/hello-kitty.png',
      tag: 'medicamento-diario',
      renotify: true,
      data: { url: '/' },
    });
    scheduledTimer = null;
  }, delay);
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if (c.url === '/' && 'focus' in c) return c.focus();
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});
