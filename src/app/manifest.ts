import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BrowserProbe — Browser Diagnostics & Privacy Tools",
    short_name: "BrowserProbe",
    description: "Free browser diagnostics, fingerprint tests, and privacy tools.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0f",
    theme_color: "#00d4ff",
    icons: [
      { src: "/favicon.png", sizes: "192x192", type: "image/png" },
      { src: "/favicon.png", sizes: "512x512", type: "image/png" },
      { src: "/favicon.png", sizes: "any", type: "image/png" },
    ],
  };
}
