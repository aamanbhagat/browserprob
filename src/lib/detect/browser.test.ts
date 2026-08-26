import { describe, expect, it } from "vitest";
import { parseBrowserClientHints, parseBrowserUserAgent } from "./browser";

const userAgents: Array<[string, string, string, boolean]> = [
  ["Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36", "Chrome", "Blink", false],
  ["Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/125.0.0.0 Mobile Safari/537.36", "Chrome", "Blink", true],
  ["Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 CriOS/125.0.6422.80 Mobile/15E148 Safari/604.1", "Chrome", "WebKit", true],
  ["Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0", "Microsoft Edge", "Blink", false],
  ["Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36 EdgA/120.0.0.0", "Microsoft Edge", "Blink", true],
  ["Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 EdgiOS/120.0 Mobile/15E148 Safari/605.1.15", "Microsoft Edge", "WebKit", true],
  ["Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0", "Firefox", "Gecko", false],
  ["Mozilla/5.0 (Android 14; Mobile; rv:126.0) Gecko/126.0 Firefox/126.0", "Firefox", "Gecko", true],
  ["Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 FxiOS/126.0 Mobile/15E148 Safari/605.1.15", "Firefox", "WebKit", true],
  ["Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 Version/17.5 Safari/605.1.15", "Safari", "WebKit", false],
  ["Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 Version/17.5 Mobile/15E148 Safari/604.1", "Safari", "WebKit", true],
  ["Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36 OPR/110.0.0.0", "Opera", "Blink", false],
  ["Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 OPiOS/4.2.0 Mobile/15E148 Safari/9537.53", "Opera", "WebKit", true],
  ["Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/122.0 Mobile Safari/537.36 SamsungBrowser/25.0", "Samsung Internet", "Blink", true],
  ["Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0 Safari/537.36 Vivaldi/6.6.3271.61", "Vivaldi", "Blink", false],
  ["Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120.0 Mobile Safari/537.36 YaBrowser/23.11.5.120", "Yandex Browser", "Blink", true],
  ["Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chromium/124.0.0.0 Safari/537.36", "Chromium", "Blink", false],
  ["Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 Focus/9000 Mobile/15E148 Safari/605.1.15", "Firefox Focus", "WebKit", true],
  ["Mozilla/5.0 (Linux; Android 11; sdk_gphone_x86 Build/RSR1; wv) AppleWebKit/537.36 Chrome/91.0.4472.114 Mobile Safari/537.36", "Chrome WebView", "Blink", true],
  ["curl/8.7.1", "Unknown", "Unknown", false],
];

describe("parseBrowserUserAgent", () => {
  it.each(userAgents)("parses %s", (ua, name, engine, mobile) => {
    const result = parseBrowserUserAgent(ua);
    expect(result.name).toBe(name);
    expect(result.engine).toBe(engine);
    expect(result.mobile).toBe(mobile);
  });

  it("preserves a full dotted version", () => {
    expect(parseBrowserUserAgent(userAgents[0][0]).version).toBe("126.0.0.0");
  });

  it("uses the Firefox version when rv is absent", () => {
    const result = parseBrowserUserAgent("Mozilla/5.0 (Android 14; Mobile) Gecko/126.0 Firefox/126.0");
    expect(result.engineVersion).toBe("126.0");
  });
});

describe("parseBrowserClientHints", () => {
  it("ignores Chromium and a GREASE brand", () => {
    expect(parseBrowserClientHints({
      brands: [
        { brand: "Not=A?Brand", version: "99" },
        { brand: "Chromium", version: "151" },
        { brand: "Google Chrome", version: "151" },
      ],
    })).toEqual({ name: "Chrome", version: "151" });
  });

  it.each(["Not A Brand", "Not_A Brand", "Not/A)Brand", "Chromium"])("returns null for ignored brand %s", (brand) => {
    expect(parseBrowserClientHints({ brands: [{ brand, version: "99" }] })).toBeNull();
  });

  it("normalizes the Microsoft Edge brand", () => {
    expect(parseBrowserClientHints({ brands: [{ brand: "Microsoft Edge", version: "150" }] })).toEqual({ name: "Microsoft Edge", version: "150" });
  });
});
