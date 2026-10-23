import { NextResponse, type NextRequest } from "next/server";
import { ADS_ENABLED } from "@/lib/ads";
import { adsCsp, createNonce } from "@/lib/csp";

// Only active when ads are enabled. Google AdSense supports only a strict, nonce-based CSP, so every
// HTML response gets a fresh nonce. Next.js reads it from the request's CSP header and applies it to
// its own scripts; the root layout passes it to the AdSense loader. Without ads, the static CSP from
// next.config.ts applies and pages stay statically rendered.
export function proxy(request: NextRequest) {
  if (!ADS_ENABLED) return NextResponse.next();

  const nonce = createNonce();
  const policy = adsCsp({ nonce, isDevelopment: process.env.NODE_ENV === "development", onVercel: Boolean(process.env.VERCEL) });
  // Google recommends trying the policy in report-only mode first.
  const header = process.env.ADS_CSP_REPORT_ONLY === "true" ? "Content-Security-Policy-Report-Only" : "Content-Security-Policy";

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", policy);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set(header, policy);
  return response;
}

export const config = {
  matcher: [
    {
      // Pages only: not API routes, static assets, metadata files or link prefetches.
      source: "/((?!api|_next/static|_next/image|favicon.ico|icon.svg|favicon.png|og-image.png|sw.js|ads.txt|robots.txt|sitemap.xml|manifest.webmanifest|llms.txt).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
