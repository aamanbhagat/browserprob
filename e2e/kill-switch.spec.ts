import { expect, test } from "@playwright/test";

// Firefox disables service workers while Playwright request routing is active, so the
// replace-the-old-worker path is exercised in Chromium and WebKit; the real worker runs everywhere.
const OLD_WORKER = `self.addEventListener("install", (e) => { self.skipWaiting(); e.waitUntil(caches.open("old-ad-cache").then((c) => c.put("/x", new Response("x")))); });
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));`;

test("a returning visitor's old worker is replaced and removed", async ({ context, page, browserName }) => {
  test.skip(browserName === "firefox", "Service workers are disabled under request routing in Playwright Firefox.");
  await context.route("**/sw.js*", (route) => route.fulfill({ contentType: "application/javascript", body: OLD_WORKER }));
  // A script-free page on the same origin, so the app's own cleanup does not interfere.
  await context.route("**/__blank", (route) => route.fulfill({ contentType: "text/html", body: "<!doctype html><title>blank</title>" }));
  await page.goto("/__blank");
  await page.evaluate(async () => {
    await navigator.serviceWorker.register("/sw.js?v=3.1.647&p=11662682");
    await navigator.serviceWorker.ready;
  });
  await expect.poll(() => page.evaluate(() => caches.keys())).toContain("old-ad-cache");

  await context.unroute("**/sw.js*");
  await page.evaluate(async () => (await navigator.serviceWorker.getRegistration())?.update());
  await expect.poll(() => page.evaluate(async () => (await navigator.serviceWorker.getRegistrations()).length), { timeout: 10_000 }).toBe(0);
  await expect.poll(() => page.evaluate(() => caches.keys())).toEqual([]);
});

test("the kill switch deletes caches and unregisters itself", async ({ page }) => {
  await page.goto("/about");
  await page.waitForLoadState("networkidle");
  await page.evaluate(async () => {
    await (await caches.open("old-ad-cache")).put("/x", new Response("x"));
    await navigator.serviceWorker.register("/sw.js");
  });
  await expect.poll(() => page.evaluate(() => caches.keys()), { timeout: 10_000 }).toEqual([]);
  await expect.poll(() => page.evaluate(async () => (await navigator.serviceWorker.getRegistrations()).length)).toBe(0);
});
