"use client";

import { useEffect } from "react";

// BrowserProbe has no service worker and does not use Cache Storage. Until October 2026 a
// third-party ad tag registered a worker here, so remove any registration and cache left on this
// origin. Delete together with public/sw.js after 2027-01-23.
export default function ServiceWorkerCleanup() {
  useEffect(() => {
    navigator.serviceWorker
      ?.getRegistrations()
      .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
      .catch(() => undefined);
    if (typeof caches !== "undefined") {
      caches
        .keys()
        .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
        .catch(() => undefined);
    }
  }, []);

  return null;
}
