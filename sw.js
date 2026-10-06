var CACHE_NAME = 'zhixue-v5';
var ASSETS = [
    '/zhixue-smart-study/',
    '/zhixue-smart-study/index.html',
    '/zhixue-smart-study/manifest.json',
    '/zhixue-smart-study/icon-192.png',
    '/zhixue-smart-study/icon-512.png',
    '/zhixue-smart-study/sw.js',
    '/zhixue-smart-study/世界地图.png',
    '/zhixue-smart-study/中国地图.webp'
];

var CDN_ASSETS = [
    'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
    'https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js',
    'https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;600;700&display=swap',
    'https://cdn.tailwindcss.com',
    'https://d3js.org/d3.v7.min.js'
];

self.addEventListener('install', function(e) {
    self.skipWaiting();
    e.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(ASSETS).catch(function(err) {}).then(function() {
                return cache.addAll(CDN_ASSETS).catch(function(err) {});
            });
        })
    );
});

self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(
                keys.map(function(k) {
                    if (k !== CACHE_NAME) return caches.delete(k);
                })
            );
        }).then(function() {
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', function(e) {
    if (e.request.method !== 'GET') return;

    e.respondWith(
        fetch(e.request).then(function(response) {
            if (!response || response.status !== 200) return response;
            var clone = response.clone();
            caches.open(CACHE_NAME).then(function(cache) {
                try { cache.put(e.request, clone); } catch(err) {}
            });
            return response;
        }).catch(function() {
            return caches.match(e.request).then(function(cached) {
                if (cached) return cached;
                if (e.request.destination === 'document') {
                    return caches.match('/zhixue-smart-study/index.html');
                }
            });
        })
    );
});
