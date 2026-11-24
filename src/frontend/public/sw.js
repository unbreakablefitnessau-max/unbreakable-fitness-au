/* Unbreakable Fitness AU — offline app shell.
 *
 * Strategy
 *  - Precache the shell, icons, fonts and the built JS/CSS at install time so
 *    the first launch after install works offline.
 *  - Navigations are network-first with a cached shell fallback, so members
 *    always get the newest build when online and a branded offline page when
 *    not.
 *  - Same-origin static assets are stale-while-revalidate: instant from cache,
 *    refreshed in the background.
 *  - The cache name carries a build version. A new deploy ships a new sw.js,
 *    which installs a fresh cache, drops the old one on activate and claims
 *    open clients, so a stale shell never persists.
 */
const VERSION = "v2";
const CACHE = `unbreakable-shell-${VERSION}`;
const OFFLINE_URL = "/offline.html";

const PRECACHE = [
  "/",
  "/offline.html",
  "/manifest.webmanifest",
  "/assets/images/app-icon-192.png",
  "/assets/images/app-icon-512.png",
  "/assets/images/app-icon-1024.png",
  "/assets/images/app-icon-maskable-512.png",
  "/assets/images/app-icon-maskable-1024.png",
  "/assets/fonts/SpaceGrotesk.woff2",
  "/assets/fonts/PlusJakartaSans.woff2",
  "/assets/fonts/JetBrainsMono.woff2",
];

/** Pull the hashed JS/CSS entry points out of the built index.html. */
async function buildAssets() {
  try {
    const response = await fetch("/", { cache: "no-store" });
    const html = await response.text();
    const found = new Set();
    const pattern = /(?:src|href)="(\/assets\/[^"]+\.(?:js|css))"/g;
    let match = pattern.exec(html);
    while (match) {
      found.add(match[1]);
      match = pattern.exec(html);
    }
    return [...found];
  } catch {
    return [];
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      const assets = await buildAssets();
      // addAll is atomic; add individually so one miss cannot fail the install.
      await Promise.all(
        [...PRECACHE, ...assets].map((url) =>
          cache.add(new Request(url, { cache: "reload" })).catch(() => undefined),
        ),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith("unbreakable-shell-") && key !== CACHE)
          .map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

/** Network-first navigation with a cached shell / offline page fallback. */
async function handleNavigation(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE);
      cache.put("/", response.clone()).catch(() => undefined);
    }
    return response;
  } catch {
    const cached = await caches.match("/");
    if (cached) return cached;
    const offline = await caches.match(OFFLINE_URL);
    if (offline) return offline;
    return new Response("You are offline.", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}

/** Stale-while-revalidate for same-origin static assets. */
async function handleAsset(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((response) => {
      if (response.ok && response.type === "basic") {
        cache.put(request, response.clone()).catch(() => undefined);
      }
      return response;
    })
    .catch(() => undefined);

  if (cached) {
    void network;
    return cached;
  }
  const response = await network;
  return response || Response.error();
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(handleNavigation(request));
    return;
  }

  event.respondWith(handleAsset(request));
});
