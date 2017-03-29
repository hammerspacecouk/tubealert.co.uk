const VERSION = 1;
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


//
// self.addEventListener('push', function(event) {
//     return event.waitUntil(
//         self.registration.pushManager.getSubscription().then(function(subscription) {
//             if (!subscription) {
//                 return null;
//             }
//             return subscription.endpoint;
//         }).then(function(endpoint) {
//             updateStatuses();
//             return fetch('/notifications/latest?endpoint=' + endpoint)
//                 .then(function(response) {
//                     return response.json();
//                 });
//         }).then(function(notification) {
//             return self.registration.showNotification(notification.title, {
//                 body: notification.description,
//                 icon: notification.image,
//                 tag: notification.url
//             });
//         })
//     );
// });
//
// self.addEventListener('notificationclick', function(event) {
//     event.notification.close();
//
//     // This looks to see if the current is already open and
//     // focuses if it is
//     event.waitUntil(
//         clients.matchAll({
//             type: "window"
//         })
//             .then(function(clientList) {
//                 for (var i = 0; i < clientList.length; i++) {
//                     var client = clientList[i],
//                         url = client.url,
//                         parts = url.split('/'),
//                         path = '/' + parts[parts.length-1];
//                     if (path == event.notification.tag && 'focus' in client) {
//                         return client.focus();
//                     }
//                 }
//                 if (clients.openWindow) {
//                     return clients.openWindow(event.notification.tag);
//                 }
//             })
//     );
// });


// function updateStatuses() {
//     fetch('/all.json')
//         .then(function(response) {
//             response.json().then(function(data) {
//                 var DB;
//                 if (!data.lines) {
//                     return null;
//                 }
//
//                 DB = indexedDB.open('TubeLines', 1);
//                 DB.onsuccess = function(evt){
//                     var database = evt.target.result,
//                         transaction = database.transaction(['data'], 'readwrite');
//                     transaction.objectStore('data').put(JSON.stringify(data), 'allLines');
//                 };
//                 DB.onupgradeneeded = function (evt) {
//                     var dbobject = evt.target.result;
//                     if (evt.oldVersion < 1) {
//                         // Create our object store and define indexes.
//                         dbobject.createObjectStore('data');
//                     }
//                 };
//             });
//         })
// }
