const CACHE_NAME = "medguard-shell-v2";
const SHELL_ASSETS = [
  "/",
  "/index.html",
  "/verify.html",
  "/dashboard.html",
  "/auth.html",
  "/manifest.webmanifest",
  "/favicon.svg",
  "/icons.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        }),
      );
    }).then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);

  // Network-first for fresh scripts and page updates
  if (event.request.mode === "navigate" || requestUrl.pathname.endsWith(".html") || requestUrl.pathname.startsWith("/assets/")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(event.request);
          if (cached) return cached;
          const cache = await caches.open(CACHE_NAME);
          const pathname = new URL(event.request.url).pathname;
          const fallbackRoute =
            pathname === "/dashboard" || pathname === "/dashboard.html"
              ? "/dashboard.html"
              : pathname === "/auth" || pathname === "/auth.html"
                ? "/auth.html"
                : pathname === "/verify" || pathname === "/verify.html"
                  ? "/verify.html"
                  : "/index.html";
          return cache.match(fallbackRoute) || cache.match("/index.html");
        }),
    );
    return;
  }

  if (requestUrl.origin === self.location.origin) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
          return response;
        })
        .catch(() => caches.match(event.request)),
    );
  }
});
