var CACHE_NAME = 'zhixue-v6-final';

self.addEventListener('install', function(e) {
    self.skipWaiting();
});

self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(keys.map(function(k) { return caches.delete(k); }));
        }).then(function() {
            return self.clients.claim();
        })
    );
});

self.addEventListener('message', function(e) {
    if (e.data === 'SKIP_WAITING') self.skipWaiting();
});

// 完全不拦截任何请求——所有请求都走网络
// 不注册 fetch 事件 = Service Worker 不拦截 = 无缓存
