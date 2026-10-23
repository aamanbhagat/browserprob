import type { NextConfig } from "next";
import { staticCsp } from "./src/lib/csp";

const isDevelopment = process.env.NODE_ENV !== "production";
const adsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Ad clicks open the advertiser's page in a new window from a cross-origin ad frame. As a precaution,
  // keep the opener relationship for such popups when ads are on; isolate fully otherwise.
  { key: "Cross-Origin-Opener-Policy", value: adsEnabled ? "same-origin-allow-popups" : "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "Permissions-Policy", value: "geolocation=(), payment=(), usb=(), bluetooth=()" },
  // With ads on, src/proxy.ts sends a per-request nonce-based policy instead (Google supports no other kind).
  ...(adsEnabled ? [] : [{ key: "Content-Security-Policy", value: staticCsp({ isDevelopment, onVercel: Boolean(process.env.VERCEL) }) }]),
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
        ],
      },
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
