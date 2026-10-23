import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BrowserProbe — Browser Diagnostics & Privacy Tools",
    short_name: "BrowserProbe",
    description: "Free browser diagnostics, fingerprint tests, and privacy tools.",
    start_url: "/",
    display: "standalone",
    background_color: "#f3f5f7",
    theme_color: "#0b6b66",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
