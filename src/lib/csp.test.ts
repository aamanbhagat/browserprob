import { describe, expect, it } from "vitest";
import { adsCsp, createNonce, staticCsp } from "./csp";

const directives = (policy: string) => Object.fromEntries(policy.split("; ").map((part) => [part.split(" ")[0], part]));

describe("staticCsp", () => {
  const policy = staticCsp({ isDevelopment: false, onVercel: true });

  it("allows only first-party scripts and no third-party hosts", () => {
    expect(directives(policy)["script-src"]).toBe("script-src 'self' 'unsafe-inline'");
    expect(policy).not.toMatch(/https:\/\/|googlesyndication|quge5|3nbf4/);
    expect(directives(policy)["frame-ancestors"]).toBe("frame-ancestors 'none'");
  });

  it("only upgrades insecure requests on Vercel and only allows eval in development", () => {
    expect(staticCsp({ isDevelopment: false, onVercel: false })).not.toContain("upgrade-insecure-requests");
    expect(policy).toContain("upgrade-insecure-requests");
    expect(staticCsp({ isDevelopment: true, onVercel: false })).toContain("'unsafe-eval'");
  });
});

describe("adsCsp", () => {
  const policy = adsCsp({ nonce: "abc123==", isDevelopment: false, onVercel: true });
  const parts = directives(policy);

  it("matches Google's strict AdSense policy", () => {
    expect(parts["object-src"]).toBe("object-src 'none'");
    expect(parts["script-src"]).toBe("script-src 'nonce-abc123==' 'unsafe-inline' 'unsafe-eval' 'strict-dynamic' https: http:");
    expect(parts["base-uri"]).toBe("base-uri 'none'");
  });

  it("does not restrict the fetch directives Google says must stay open", () => {
    for (const directive of ["default-src", "img-src", "frame-src", "connect-src", "style-src"]) expect(parts[directive]).toBeUndefined();
  });

  it("does not allowlist any domain", () => expect(policy).not.toMatch(/https:\/\/[a-z]/));
});

describe("createNonce", () => {
  it("returns a fresh 128-bit base64 value each time", () => {
    const a = createNonce();
    expect(a).toMatch(/^[A-Za-z0-9+/]{22}==$/);
    expect(createNonce()).not.toBe(a);
  });
});
