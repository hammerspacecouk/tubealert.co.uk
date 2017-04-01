const VERSION = 3;
const CACHE_NAME = 'tubealertcouk-sw-cache-' + VERSION;

// Perform install steps (cache statics)
self.addEventListener('install', event => event.waitUntil(
    caches.open(CACHE_NAME)
        .then(cache =>
            fetch("assets-manifest.json")
                .then(response => response.json())
                .then(assets =>
                    cache.addAll([
                        "/",
                        assets["app.js"],
                        assets["app.css"]
                    ])
                )
        ).then(() => self.skipWaiting())
));


// clear old cache
self.addEventListener('activate', event => event.waitUntil(
    caches.keys().then(keyList => Promise.all(
        keyList.map(key => {
            if (key !== CACHE_NAME) {
                return caches.delete(key);
            }
        })
    ))
));

// Check cache for values
self.addEventListener('fetch', event => event.respondWith(
    caches.open(CACHE_NAME)
        .then(cache => cache.match(event.request)
            .then(response => {
                return response || fetch(event.request).then(response);
            })
        )
));

self.addEventListener('push', event => {
    const data = event.data.json();
    const title = data.title;

    event.waitUntil(self.registration.showNotification(title, data));

});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    // This looks to see if the target path is already open and
    // focuses if it is
    event.waitUntil(
        clients.matchAll({
            type: "window"
        })
            .then(function(clientList) {
                for (let i = 0; i < clientList.length; i++) {
                    const client = clientList[i];
                    const url = client.url;
                    const parts = url.split('/');
                    const path = '/' + parts[parts.length-1];
                    if (path === event.notification.tag && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow(event.notification.tag);
                }
            })
    );
});
