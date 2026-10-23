import { describe, expect, it } from "vitest";
import { summarizeNavigationTiming } from "./network";

const entry = (overrides = {}) => ({
  nextHopProtocol: "h2", startTime: 0, domainLookupStart: 5, domainLookupEnd: 25, connectStart: 25, connectEnd: 90,
  secureConnectionStart: 40, requestStart: 91, responseStart: 191, responseEnd: 230, transferSize: 18_000, type: "navigate" as NavigationTimingType,
  ...overrides,
});

describe("summarizeNavigationTiming", () => {
  it("derives each phase of a fresh HTTPS load", () => {
    expect(summarizeNavigationTiming(entry())).toEqual({
      protocol: "HTTP/2", dns: 20, connect: 65, tls: 50, ttfb: 100, download: 39, total: 230, transferSize: 18_000, navigationType: "navigate",
    });
  });
  it("reports reused connections and hidden sizes as missing rather than zero", () => {
    const result = summarizeNavigationTiming(entry({ secureConnectionStart: 0, transferSize: 0, nextHopProtocol: "" }));
    expect(result).toMatchObject({ tls: null, transferSize: null, protocol: "Not reported" });
  });
  it("names HTTP/3", () => expect(summarizeNavigationTiming(entry({ nextHopProtocol: "h3" }))?.protocol).toBe("HTTP/3"));
  it("returns null without an entry", () => expect(summarizeNavigationTiming(undefined)).toBeNull());
});
