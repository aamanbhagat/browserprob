import { expect, test, type Page } from "@playwright/test";

// These tests need a build with ads switched on; see docs/ADSENSE.md:
//   NEXT_PUBLIC_ADS_ENABLED=true npm run build && E2E_ADS=1 npm run test:e2e -- e2e/ads.spec.ts
// With E2E_ADS_SLOTS=1 the build must also define the NEXT_PUBLIC_ADSENSE_SLOT_* variables; every request
// to Google is then answered by a local stub, so no slot ID ever reaches Google during the test.
test.skip(process.env.E2E_ADS !== "1", "Requires a build with NEXT_PUBLIC_ADS_ENABLED=true.");

const LOADER = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";

async function watchViolations(page: Page) {
  await page.addInitScript(() => {
    const store: string[] = [];
    (window as unknown as { __csp: string[] }).__csp = store;
    document.addEventListener("securitypolicyviolation", (event) => store.push(`${event.effectiveDirective} ${event.blockedURI}`));
  });
  return () => page.evaluate(() => (window as unknown as { __csp: string[] }).__csp);
}

test.describe("real AdSense loader", () => {
  test.skip(process.env.E2E_ADS_SLOTS === "1", "The slot run stubs Google instead.");

  for (const route of ["/", "/tools/webrtc-leak-test", "/blog/ip-address-explained", "/privacy-policy"]) {
    test(`${route} loads the AdSense script under Google's strict CSP without violations`, async ({ page }) => {
      const violations = await watchViolations(page);
      const errors: string[] = [];
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      const loader = page.waitForResponse((response) => response.url().startsWith(LOADER));
      const response = await page.goto(route);

      const policy = response?.headers()["content-security-policy"] ?? "";
      expect(policy).toMatch(/script-src 'nonce-[A-Za-z0-9+/=]+' 'unsafe-inline' 'unsafe-eval' 'strict-dynamic' https: http:/);
      expect(policy).toContain("object-src 'none'");
      expect(policy).toContain("base-uri 'none'");
      expect(response?.headers()["cross-origin-opener-policy"]).toBe("same-origin-allow-popups");

      expect((await loader).status()).toBe(200);
      const nonce = policy.match(/'nonce-([^']+)'/)?.[1];
      // Browsers hide the nonce attribute's value from the DOM, so read it from the element property.
      expect(await page.locator("script#adsense-loader").evaluate((el) => (el as HTMLScriptElement).nonce)).toBe(nonce);
      await expect(page.locator('meta[name="google-adsense-account"]')).toHaveAttribute("content", "ca-pub-1720101320139769");

      await page.waitForTimeout(3000);
      expect(await violations()).toEqual([]);
      expect(errors).toEqual([]);
    });
  }

  test("each response gets a fresh nonce", async ({ request }) => {
    const nonceOf = async () => (await request.get("/tools/what-is-my-ip")).headers()["content-security-policy"].match(/'nonce-([^']+)'/)?.[1];
    const first = await nonceOf();
    expect(first).toBeTruthy();
    expect(await nonceOf()).not.toBe(first);
  });
});

test.describe("ad slot placement", () => {
  test.skip(process.env.E2E_ADS_SLOTS !== "1", "Requires a build with NEXT_PUBLIC_ADSENSE_SLOT_* set.");

  test.beforeEach(async ({ context }) => {
    await context.route(/googlesyndication|doubleclick|google\.com|gstatic|googleadservices/, (route) =>
      route.fulfill({ contentType: "application/javascript", body: "window.__adsStub = true;" }),
    );
  });

  test("tool pages reserve labelled space for two ads below the result and away from buttons", async ({ page }) => {
    await page.addInitScript(() => {
      (window as unknown as { __cls: number }).__cls = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as unknown as Array<{ value: number; hadRecentInput: boolean }>) {
          if (!entry.hadRecentInput) (window as unknown as { __cls: number }).__cls += entry.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
    });
    await page.goto("/tools/webrtc-leak-test");
    const slots = page.locator('aside[aria-label="Advertisement"]');
    await expect(slots).toHaveCount(2);
    await expect(slots.first().getByText("Advertisement")).toBeVisible();

    const resultsBottom = await page.locator('section[aria-label="Your results"]').evaluate((el) => el.getBoundingClientRect().bottom + window.scrollY);
    for (const box of await slots.evaluateAll((els) => els.map((el) => {
      const rect = el.getBoundingClientRect();
      return { top: rect.top + window.scrollY, bottom: rect.bottom + window.scrollY, height: (el.querySelector("ins") as HTMLElement).offsetHeight };
    }))) {
      expect(box.top).toBeGreaterThan(resultsBottom + 100);
      expect(box.height).toBe(250);
      const nearbyButtons = await page.locator("button, a[class*='Button'], a[class*='button']").evaluateAll(
        (els, area) => els.filter((el) => {
          const rect = el.getBoundingClientRect();
          const top = rect.top + window.scrollY;
          const bottom = rect.bottom + window.scrollY;
          return bottom > area.top - 24 && top < area.bottom + 24;
        }).length,
        box,
      );
      expect(nearbyButtons).toBe(0);
    }

    await page.waitForLoadState("networkidle");
    expect(await page.evaluate(() => (window as unknown as { __cls: number }).__cls)).toBeLessThan(0.05);
  });

  test("legal and about pages never show ads", async ({ page }) => {
    for (const route of ["/privacy-policy", "/terms", "/advertising-and-cookies", "/about", "/contact", "/does-not-exist"]) {
      await page.goto(route);
      await expect(page.locator('aside[aria-label="Advertisement"]')).toHaveCount(0);
    }
  });

  test("guides show one ad mid-article and one at the end", async ({ page }) => {
    await page.goto("/blog/ip-address-explained");
    await expect(page.locator('aside[aria-label="Advertisement"]')).toHaveCount(2);
  });
});
