const CACHE_NAME = 'math-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/icon-192.png',
  '/icon-512.png'
];

// 설치 시 파일 캐시
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('캐시 저장 완료');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// 활성화 시 오래된 캐시 삭제
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 요청 시 캐시 먼저 확인
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 캐시에 있으면 캐시에서, 없으면 네트워크에서
        return response || fetch(event.request);
      })
      .catch(() => {
        // 오프라인이고 캐시에도 없으면
        return caches.match('/index.html');
      })
  );
});
