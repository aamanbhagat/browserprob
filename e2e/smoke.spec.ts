import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { ALL_ROUTES, TOOL_ROUTES } from "./routes";

// Console messages that come from the browser itself rather than from the page.
const IGNORED_CONSOLE = [/No available adapters/i];

for (const route of ALL_ROUTES) {
  test(`${route} loads cleanly`, async ({ page, baseURL }) => {
    const errors: string[] = [];
    const foreignRequests: string[] = [];
    const origin = new URL(baseURL!).origin;
    page.on("console", (message) => {
      if (message.type() === "error" && !IGNORED_CONSOLE.some((pattern) => pattern.test(message.text()))) errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(`uncaught: ${error.message}`));
    page.on("request", (request) => {
      const url = new URL(request.url());
      if (/^https?:$/.test(url.protocol) && url.origin !== origin) foreignRequests.push(url.origin);
    });

    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toBeVisible();

    if (TOOL_ROUTES.includes(route)) {
      // Each tool finishes its probe and replaces the placeholder rows.
      await expect(page.locator('[aria-busy="true"]')).toHaveCount(0, { timeout: 15_000 });
    }

    const accessibility = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    expect(accessibility.violations.map((violation) => `${violation.id}: ${violation.nodes.map((node) => node.target.join(" ")).join(", ")}`)).toEqual([]);
    expect(errors).toEqual([]);
    expect([...new Set(foreignRequests)]).toEqual([]);
  });
}

test("the home page check runs only after a click", async ({ page }) => {
  const ipRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/api/ip")) ipRequests.push(request.url());
  });
  await page.goto("/");
  await page.waitForTimeout(1000);
  expect(ipRequests).toEqual([]);
  await page.getByRole("button", { name: "Run browser check" }).click();
  await expect(page.getByRole("heading", { name: "Your browser report" })).toBeVisible({ timeout: 15_000 });
  expect(ipRequests.length).toBeGreaterThan(0);
});
