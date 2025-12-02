<change>
<file>sw.js</file>
<description>Clean sw.js - COPY ONLY THE CODE INSIDE</description>
<content><![CDATA[const CACHE_NAME = 'rolando-kitchen-v46';
// Use relative paths for GitHub Pages support
const urlsToCache = [
'./',
'./index.html',
'./manifest.json'
];
self.addEventListener('install', event => {
event.waitUntil(
caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
);
self.skipWaiting();
});
self.addEventListener('activate', event => {
event.waitUntil(
caches.keys().then(cacheNames => {
return Promise.all(
cacheNames.filter(name => name !== CACHE_NAME)
.map(name => caches.delete(name))
);
})
);
self.clients.claim();
});
self.addEventListener('fetch', event => {
const requestUrl = new URL(event.request.url);
// Pollinations.ai Image Caching (Cache First, Network Fallback)
if (requestUrl.hostname === 'image.pollinations.ai') {
event.respondWith(
caches.open(CACHE_NAME).then(cache => {
return cache.match(event.request).then(response => {
if (response) return response;
return fetch(event.request).then(networkResponse => {
if(networkResponse.ok) {
cache.put(event.request, networkResponse.clone());
}
return networkResponse;
});
});
})
);
return;
}
// Unsplash Image Caching (Cache First for static fallbacks)
if (requestUrl.hostname === 'images.unsplash.com') {
event.respondWith(
caches.open(CACHE_NAME).then(cache => {
return cache.match(event.request).then(response => {
if (response) return response;
return fetch(event.request).then(networkResponse => {
if(networkResponse.ok) {
cache.put(event.request, networkResponse.clone());
}
return networkResponse;
});
});
})
);
return;
}
// App Shell (Stale-While-Revalidate)
event.respondWith(
caches.match(event.request).then(response => {
const fetchPromise = fetch(event.request).then(networkResponse => {
caches.open(CACHE_NAME).then(cache => {
if(event.request.method === 'GET' && networkResponse.ok) {
cache.put(event.request, networkResponse.clone());
}
});
return networkResponse;
});
return response || fetchPromise;
})
);
});]]></content>
</change>
