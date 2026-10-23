import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // A crawler follows only the most specific group that names it, so each group is complete.
      { userAgent: "Googlebot", allow: "/", disallow: ["/api/"] },
      // Google's AdSense crawler needs to read every page that may show ads.
      { userAgent: "Mediapartners-Google", allow: "/" },
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
