import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

// Generated image and icon routes. They are not pages and should not appear in search results.
// robots.txt matches by prefix, so these also cover the cache-busting query strings Next.js adds.
const ASSET_PATHS = ["/opengraph-image", "/twitter-image", "/favicon.ico"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // A crawler follows only the most specific group that names it, so each group is complete.
      { userAgent: "Googlebot", allow: "/", disallow: ["/api/", ...ASSET_PATHS] },
      // Google's AdSense crawler needs to read every page that may show ads.
      { userAgent: "Mediapartners-Google", allow: "/" },
      { userAgent: "*", allow: "/", disallow: ["/api/", ...ASSET_PATHS] },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
