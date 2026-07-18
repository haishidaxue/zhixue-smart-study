var CACHE_NAME = 'zhixue-v3';
var ASSETS = [
    '/zhixue-smart-study/',
    '/zhixue-smart-study/index.html',
    '/zhixue-smart-study/manifest.json',
    '/zhixue-smart-study/icon-192.png',
    '/zhixue-smart-study/icon-512.png'
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
    e.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(ASSETS).catch(function(err) {
                console.log('Cache addAll partial fail:', err);
            }).then(function() {
                return cache.addAll(CDN_ASSETS).catch(function(err) {
                    console.log('CDN cache partial fail:', err);
                });
            });
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(
                keys.filter(function(k) { return k !== CACHE_NAME; })
                    .map(function(k) { return caches.delete(k); })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', function(e) {
    if (e.request.method !== 'GET') return;

    e.respondWith(
        caches.match(e.request).then(function(cached) {
            if (cached) return cached;

            return fetch(e.request).then(function(response) {
                if (!response || response.status !== 200) return response;

                var clone = response.clone();
                caches.open(CACHE_NAME).then(function(cache) {
                    try { cache.put(e.request, clone); } catch(err) {}
                });
                return response;
            }).catch(function() {
                if (e.request.destination === 'document') {
                    return caches.match('/zhixue-smart-study/index.html');
                }
            });
        })
    );
});
