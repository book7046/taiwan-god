const CACHE_NAME = 'hoho-cards-v1';
// 快取核心檔案，讓使用者網路不穩也能開啟 App 的外殼
const ASSETS = [
  './',
  './index.html',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;700&display=swap'
];

// 安裝 Service Worker 並快取檔案
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS);
      })
  );
  self.skipWaiting();
});

// 攔截網頁請求，優先讀取快取
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 如果有快取就回傳快取，沒有就透過網路抓取
        return response || fetch(event.request);
      })
  );
});

// 清除舊版本的快取
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});