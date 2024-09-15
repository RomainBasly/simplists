importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js"
);
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

const urlsToCache = [
  "/",
  "/home",
  "/lists/create-list",
  "/offline",
  "/images/logos/logo-96x96.png",
];

const ignoreUrlParametersMatchingPlugin = {
  // This hook is called whenever Workbox is about to use a URL as a cache key.
  cacheKeyWillBeUsed: async ({ request, mode }) => {
    // The URL we might modify to create a custom cache key.
    const url = new URL(request.url);

    // Example: Remove specific search parameters like '_rsc'.
    // You can extend this logic to ignore other parameters or modify the URL as needed.
    url.searchParams.delete("_rsc");

    // Return the modified URL as a string to be used as the cache key.
    return url.toString();
  },
};

workbox.routing.registerRoute(
  ({ url, request }) => request.mode === "navigate",
  new workbox.strategies.NetworkFirst({
    cacheName: "pages-cache",
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
    ignoreUrlParametersMatchingPlugin,
  })
);
workbox.routing.registerRoute(
  ({ url, request }) => request.mode === "navigate",
  new workbox.strategies.NetworkFirst({
    cacheName: "pages-cache-rsc",
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  })
);
workbox.routing.registerRoute(
  ({ request }) => request.destination === "font",
  new workbox.strategies.CacheFirst({
    cacheName: "font-cache",
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        maxEntries: 30,
      }),
    ],
  })
);
workbox.routing.registerRoute(
  ({ request }) => ["style", "script", "image"].includes(request.destination),
  new workbox.strategies.CacheFirst({
    cacheName: "assets-cache",
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 100, // Adjust based on your needs
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
);
workbox.routing.registerRoute(
  new RegExp("https://stingray-app-69yxe.ondigitalocean.app/.*"),
  new workbox.strategies.NetworkFirst({
    cacheName: "backend-api-cache",
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
);
workbox.routing.registerRoute(
  new RegExp("http://localhost:8000/api/"),
  new workbox.strategies.NetworkFirst({
    cacheName: "api-cache-dev",
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
);
workbox.routing.setCatchHandler(({ event }) => {
  switch (event.request.destination) {
    case "document":
      return caches.match("/offline");
      break;
    case "image":
      return caches.match("/images/logos/logo-96x96.png");
      break;
    default:
      // If we don't have a fallback, just return an error response.
      return Response.error();
  }
});

// Use self instead of window for service workers
self.addEventListener("install", (event) => {
  // event.waitUntil(
  //   caches
  //     .open(workbox.core.cacheNames.precache) // Use workbox's precache cache name for consistency
  //     .then((cache) => {
  //       return cache.addAll(urlsToCache);
  //     })
  // );
  self.skipWaiting();
  console.log("Service Worker installing.");
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activated.");
  event.waitUntil(clients.claim());
});

// self.addEventListener("message", (event) => {
//   let data = event.data;
//   console.log("SW received", data);

//   if ("checkOnline" in data) {
//     let url = "/images/logos/logo-128x128.png";
//     console.log("I passed here in the checkOnline condition");
//     event.waitUntil(
//       fetch(url, { method: "HEAD" }).then((response) => {
//         if (response.ok) {
//           sendMessageToClient({ isOnline: true });
//         } else {
//           return sendMessage({ isOnline: false });
//         }
//       })
//     );
//   }
// });

self.clients.matchAll().then((clients) => {
  clients.forEach((client) => {
    client.postMessage({
      action: "reinitializeWebSocket",
    });
  });
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.pathname === "/images/leightWeightImage.png") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("/offline"))
    );
    return;
  }

  if (url.pathname.startsWith("/api/user/")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        event.waitUntil(sendMessage({ isOnline: false }));
        return caches.match("/offline").then((response) => {
          if (response) {
            return response;
          }
          return new Response("You are offline", {
            headers: { "Content-Type": "text/plain" },
          });
        });
      });
    })
  );

  if (event.request.mode === "navigate" && url.pathname === "/") {
    event.respondWith(
      Response.redirect(new URL("/home", event.request.url).href)
    );
    return;
  }

  if (event.request.mode === "navigate") {
    // Assuming you want to trigger WebSocket re-initialization on navigation
    event.waitUntil(sendMessage({ action: "reinitializeWebSocket" }));
  }
});

const sendMessage = async (message) => {
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      console.log("reconnect");
      client.postMessage(message);
    });
  });
};
