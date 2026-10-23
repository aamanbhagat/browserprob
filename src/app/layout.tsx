import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import ServiceWorkerCleanup from "@/components/ServiceWorkerCleanup";

export const metadata: Metadata = {
  metadataBase: new URL("https://browserprobe.app"),
  applicationName: "BrowserProbe",
  alternates: {
    canonical: "/",
  },
  title: {
    default: "BrowserProbe — Free Browser Diagnostics & Privacy Tools",
    template: "%s | BrowserProbe",
  },
  description:
    "See what your browser reports to websites. Run clear, evidence-based checks for browser version, IP, WebRTC, fingerprinting, screen, storage, and web features.",
  keywords: [
    "browser probe",
    "what is my browser",
    "browser fingerprint test",
    "webrtc leak test",
    "browser information",
    "privacy tools",
    "browser diagnostics",
  ],
  authors: [{ name: "BrowserProbe" }],
  creator: "BrowserProbe",
  category: "technology",
  referrer: "strict-origin-when-cross-origin",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://browserprobe.app",
    siteName: "BrowserProbe",
    title: "BrowserProbe — Free Browser Diagnostics & Privacy Tools",
    description:
      "Generate a clear browser diagnostic report with evidence-based privacy, IP, fingerprinting, screen, storage, and feature checks.",
  },
  twitter: {
    card: "summary_large_image",
    title: "BrowserProbe — Free Browser Diagnostics & Privacy Tools",
    description:
      "Generate a clear browser diagnostic report with evidence-based privacy, IP, fingerprinting, screen, storage, and feature checks.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "BrowserProbe",
    url: "https://browserprobe.app",
    description:
      "Evidence-based browser diagnostics and privacy tools that explain what websites can observe about your browser, device, and network.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </head>
      <body>
        <a href="#main-content" className="skipLink">Skip to content</a>
        <SiteChrome position="header" />
        <main id="main-content">{children}</main>
        <SiteChrome position="footer" />
        <ServiceWorkerCleanup />
      </body>
    </html>
  );
}
