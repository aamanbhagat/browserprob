import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { ALL_ROUTES, TOOL_ROUTES } from "./routes";

// Colour contrast is checked separately for the dark theme, which uses its own palette.
test.use({ colorScheme: "dark" });
test.skip(({ browserName }) => browserName !== "chromium", "Contrast does not depend on the engine.");

for (const route of ALL_ROUTES) {
  test(`${route} meets WCAG AA in dark mode`, async ({ page }) => {
    await page.goto(route);
    if (TOOL_ROUTES.includes(route)) await expect(page.locator('[aria-busy="true"]')).toHaveCount(0, { timeout: 15_000 });
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
  });
}
