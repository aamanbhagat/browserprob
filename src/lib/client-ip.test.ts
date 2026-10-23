import { describe, expect, it } from "vitest";
import { readLocationHint, resolveClientIp } from "./client-ip";

const headers = (values: Record<string, string>) => new Headers(values);

describe("resolveClientIp", () => {
  it("prefers the Vercel platform header", () => {
    const result = resolveClientIp(headers({ "x-vercel-forwarded-for": "203.0.113.9", "x-forwarded-for": "198.51.100.1" }));
    expect(result).toMatchObject({ ip: "203.0.113.9", version: 4, source: "x-vercel-forwarded-for" });
  });

  it("takes the first valid entry of a forwarded list", () => {
    expect(resolveClientIp(headers({ "x-forwarded-for": "garbage, 8.8.8.8, 1.1.1.1" })).ip).toBe("8.8.8.8");
  });

  it("unwraps IPv4-mapped IPv6 before classifying", () => {
    const result = resolveClientIp(headers({ "x-forwarded-for": "::ffff:127.0.0.1" }));
    expect(result).toMatchObject({ ip: "127.0.0.1", version: 4, scope: "loopback", rangeLabel: "Loopback (this device)" });
  });

  it("reports public IPv6 addresses without inventing an IPv4 one", () => {
    const result = resolveClientIp(headers({ "x-forwarded-for": "2001:4860:4860::8888" }));
    expect(result).toMatchObject({ ip: "2001:4860:4860::8888", version: 6, scope: "public", rangeLabel: null });
  });

  it("returns nulls when no usable header exists, instead of guessing", () => {
    expect(resolveClientIp(headers({ "x-forwarded-for": "unknown" }))).toEqual({
      ip: null, version: null, scope: null, rangeLabel: null, source: null, location: null,
    });
  });
});

describe("readLocationHint", () => {
  it("decodes RFC 3986-encoded city names", () => {
    expect(readLocationHint(headers({ "x-vercel-ip-city": "S%C3%A3o%20Paulo", "x-vercel-ip-country": "BR" }))).toEqual({
      city: "São Paulo", country: "BR", region: null, timezone: null,
    });
  });
  it("returns null when the platform sends no location", () => expect(readLocationHint(headers({}))).toBeNull());
});
