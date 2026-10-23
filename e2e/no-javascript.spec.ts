import { expect, test } from "@playwright/test";

// Playwright disables script execution without turning off the HTML parser's scripting flag, so
// browsers under test do not render <noscript> content the way a browser with JavaScript switched off
// does. The <noscript> answer is therefore checked in the server HTML, and the visible fallback in the page.
test.use({ javaScriptEnabled: false });

test("the JavaScript test answers when JavaScript is off", async ({ page, request }) => {
  const html = await (await request.get("/tools/javascript-info")).text();
  expect(html).toMatch(/<noscript><p[^>]*>No — JavaScript is turned off or blocked in this browser\./);
  await page.goto("/tools/javascript-info");
  await expect(page.getByText("If this message does not change within a few seconds, JavaScript is turned off or blocked")).toBeVisible();
});

test("tool pages still explain themselves without JavaScript", async ({ page, request }) => {
  const html = await (await request.get("/tools/webrtc-leak-test")).text();
  expect(html).toContain("needs JavaScript to read the values");
  await page.goto("/tools/webrtc-leak-test");
  await expect(page.getByRole("heading", { level: 1, name: "WebRTC leak test" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Frequently asked questions" })).toBeVisible();
});
