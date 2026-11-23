/* Kode Nusantara service worker.
   Ubah CACHE_VERSION setiap kali index.html atau aset berubah, supaya pemain menerima versi baru.
   Versi baru TIDAK mengambil alih otomatis: halaman menampilkan tombol "Muat ulang" di menu
   dan baru mengirim pesan SKIP_WAITING saat pemain menekannya (progres di tengah tahap tidak hilang). */
const CACHE_VERSION = "kn-v24-1";
const CORE = ["./", "index.html", "manifest.webmanifest",
  "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-192.png", "icons/maskable-512.png",
  "icons/apple-touch-icon.png", "icons/favicon-32.png"];
const FONT_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];
const NAV_TIMEOUT_MS = 4000;

self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE_VERSION);
    await Promise.all(CORE.map(u => c.add(new Request(u, {cache: "reload"})).catch(() => {})));
  })());
});

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith("kn-") && k !== CACHE_VERSION).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("message", e => { if (e.data && e.data.type === "SKIP_WAITING") self.skipWaiting(); });

function timeout(ms) { return new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms)); }

async function navigation(req) {
  const c = await caches.open(CACHE_VERSION);
  try {
    const res = await Promise.race([fetch(req), timeout(NAV_TIMEOUT_MS)]);
    if (res && res.ok) c.put("index.html", res.clone());
    return res;
  } catch (err) {
    return (await c.match("index.html")) || (await c.match("./")) || Response.error();
  }
}

async function staleWhileRevalidate(req) {
  const c = await caches.open(CACHE_VERSION);
  const hit = await c.match(req);
  const net = fetch(req).then(res => { if (res && (res.ok || res.type === "opaque")) c.put(req, res.clone()); return res; }).catch(() => null);
  return hit || (await net) || Response.error();
}

async function cacheFirst(req) {
  const c = await caches.open(CACHE_VERSION);
  const hit = await c.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res && res.ok) c.put(req, res.clone());
  return res;
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (req.mode === "navigate" && url.origin === location.origin) { e.respondWith(navigation(req)); return; }
  if (FONT_HOSTS.includes(url.hostname)) { e.respondWith(staleWhileRevalidate(req)); return; }
  if (url.origin === location.origin) { e.respondWith(cacheFirst(req).catch(() => caches.match(req).then(r => r || Response.error()))); }
});
