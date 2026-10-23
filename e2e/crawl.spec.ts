import { expect, test } from "@playwright/test";

test.skip(({ browserName }) => browserName !== "chromium", "One crawl is enough; links do not depend on the engine.");

test("every internal link resolves", async ({ page, request, baseURL }) => {
  const origin = new URL(baseURL!).origin;
  const queue = ["/"];
  const visited = new Set<string>();
  const broken: string[] = [];

  while (queue.length > 0) {
    const path = queue.shift()!;
    if (visited.has(path)) continue;
    visited.add(path);

    const response = await request.get(path, { maxRedirects: 5 });
    if (response.status() >= 400) {
      broken.push(`${path} → ${response.status()}`);
      continue;
    }
    if (!(response.headers()["content-type"] || "").includes("text/html")) continue;

    await page.goto(path);
    const hrefs = await page.$$eval("a[href]", (anchors) => anchors.map((anchor) => (anchor as HTMLAnchorElement).href));
    for (const href of hrefs) {
      const url = new URL(href);
      if (url.origin !== origin) continue;
      const next = url.pathname;
      if (!visited.has(next) && !queue.includes(next)) queue.push(next);
    }
  }

  expect(broken).toEqual([]);
  expect(visited.size).toBeGreaterThan(20);
});
