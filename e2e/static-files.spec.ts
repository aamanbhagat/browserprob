import { expect, test } from "@playwright/test";
import { tools } from "../src/lib/tools";
import { ALL_ROUTES, expectedH1 } from "./routes";

test.skip(({ browserName }) => browserName !== "chromium", "Plain HTTP checks; the browser engine is irrelevant.");

test("ads.txt lists only the Google AdSense seller line", async ({ request }) => {
  const response = await request.get("/ads.txt");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("text/plain");
  expect((await response.text()).trim()).toBe("google.com, pub-1720101320139769, DIRECT, f08c47fec0942fa0");
});

test("robots.txt and sitemap.xml are served", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  const robotsText = await robots.text();
  expect(robotsText).toContain("User-Agent: Mediapartners-Google");
  expect(robotsText).toContain("Sitemap: https://browserprobe.app/sitemap.xml");

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  for (const tool of tools) expect(xml).toContain(`https://browserprobe.app/tools/${tool.slug}`);
});

test("sw.js is the kill switch, not an ad worker", async ({ request }) => {
  const response = await request.get("/sw.js");
  expect(response.status()).toBe(200);
  expect(response.headers()["cache-control"]).toContain("no-cache");
  const body = await response.text();
  expect(body).toContain("registration.unregister()");
  expect(body).not.toContain("importScripts");
});

for (const route of ALL_ROUTES) {
  test(`${route} has its heading and body text in the server HTML`, async ({ request }) => {
    const response = await request.get(route);
    expect(response.status()).toBe(200);
    const html = await response.text();
    const h1 = expectedH1(route);
    if (h1) expect(html).toContain(h1.replace(/&/g, "&amp;").replace(/'/g, "&#x27;").replace(/"/g, "&quot;"));
    const text = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
    // Comfortably more than navigation and footer alone.
    expect(text.split(" ").length).toBeGreaterThan(250);
    expect(html).toMatch(/<link rel="canonical" href="https:\/\/browserprobe\.app/);
  });
}
