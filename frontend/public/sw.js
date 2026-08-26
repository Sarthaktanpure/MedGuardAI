const CACHE_NAME = "medguard-shell-v1";
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
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(async () => {
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
      caches.match(event.request).then((cached) => {
        if (cached) {
          return cached;
        }

        return fetch(event.request).then((response) => {
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
          return response;
        });
      }),
    );
  }
});
