const CACHE_NAME = 'ai-assistant-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/?start=welcome',
  '/manifest.json',
  '/favicon.svg',
  '/apple-touch-icon.svg',
  '/icon-192x192.svg',
  '/icon-512x512.svg',
  '/assets/果仁-头像.png'
];

// 安装事件 - 缓存资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await Promise.allSettled(
        urlsToCache.map(async (url) => {
          try {
            const resp = await fetch(url, { cache: 'no-cache' });
            if (resp && resp.ok) await cache.put(url, resp);
          } catch {}
        })
      );
      await self.skipWaiting();
    })()
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names.map((n) => (n !== CACHE_NAME ? caches.delete(n) : Promise.resolve()))
      );
      await self.clients.claim();
    })()
  );
});

// 拦截网络请求
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
      const cached = await caches.match(event.request);
      if (cached) return cached;
      try {
        const netResp = await fetch(event.request);
        if (netResp && netResp.ok && netResp.type === 'basic') {
          const cache = await caches.open(CACHE_NAME);
        if (netResp && netResp.ok && netResp.type === 'basic') {
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, netResp.clone());
          const offline = await caches.match('/');
          if (offline) return offline;
        }
        return new Response('', { status: 503 });
      }
    })()
  );
});

// 处理推送通知
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : '果仁AI有新消息',
    icon: '/icon-192x192.svg',
    badge: '/icon-192x192.svg',
    vibrate: [100, 50, 100],
    data: { dateOfArrival: Date.now(), primaryKey: 1 },
    actions: [
      { action: 'explore', title: '查看详情', icon: '/icon-192x192.svg' },
      { action: 'close', title: '关闭', icon: '/icon-192x192.svg' }
    ]
  };
  event.waitUntil(self.registration.showNotification('果仁-沉浸式AI学习空间', options));
});

// 处理通知点击
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = '/';
  if (event.action === 'close') return;
  event.waitUntil(clients.openWindow(url));
});

// 处理后台同步
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  return Promise.resolve();
}
