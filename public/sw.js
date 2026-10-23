// Kill-switch service worker.
//
// Until October 2026 this URL served a third-party Monetag push-notification worker
// (3nbf4.com zone 11662682) that the ad tag registered in visitors' browsers.
// Browsers re-check a registered worker's script when the visitor navigates, so serving
// this file at the same URL replaces the old worker. It clears this origin's caches,
// drops any push subscription and unregisters itself. Nothing on the site registers a
// service worker any more.
//
// Keep this file deployed until at least 2027-01-23.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      await self.clients.claim();
      try {
        const subscription = await self.registration.pushManager?.getSubscription();
        await subscription?.unsubscribe();
      } catch {
        // Push may be unavailable; unregistering below removes the subscription anyway.
      }
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();
    })(),
  );
});
