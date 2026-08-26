import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";

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
        <script
          id="chrome-load-times-compat"
          dangerouslySetInnerHTML={{
            __html: `(() => {
              const chromeApi = window.chrome;
              if (!chromeApi || typeof chromeApi.loadTimes !== "function") return;
              const toEpochSeconds = (milliseconds) =>
                (performance.timeOrigin + milliseconds) / 1000;
              Object.defineProperty(chromeApi, "loadTimes", {
                configurable: true,
                value: () => {
                  const navigation = performance.getEntriesByType("navigation")[0];
                  const paint = performance.getEntriesByName("first-paint")[0];
                  const protocol = navigation?.nextHopProtocol || "";
                  return {
                    requestTime: toEpochSeconds(navigation?.requestStart || 0),
                    startLoadTime: toEpochSeconds(navigation?.startTime || 0),
                    commitLoadTime: toEpochSeconds(navigation?.responseStart || 0),
                    finishDocumentLoadTime: toEpochSeconds(navigation?.domContentLoadedEventEnd || 0),
                    finishLoadTime: toEpochSeconds(navigation?.loadEventEnd || performance.now()),
                    firstPaintTime: toEpochSeconds(paint?.startTime || navigation?.responseEnd || 0),
                    firstPaintAfterLoadTime: 0,
                    navigationType: navigation?.type || "navigate",
                    wasFetchedViaSpdy: protocol === "h2" || protocol === "h3",
                    wasNpnNegotiated: Boolean(protocol),
                    npnNegotiatedProtocol: protocol,
                    wasAlternateProtocolAvailable: false,
                    connectionInfo: protocol,
                  };
                },
              });
            })();`,
          }}
        />
        <script
          id="browserprobe-monetization-loader"
          dangerouslySetInnerHTML={{
            __html: `(() => {
              const loadTag = () => {
                if (document.querySelector('script[data-zone="273538"][src="https://quge5.com/88/tag.min.js"]')) return;
                const tag = document.createElement("script");
                tag.src = "https://quge5.com/88/tag.min.js";
                tag.dataset.zone = "273538";
                tag.async = true;
                tag.fetchPriority = "low";
                tag.setAttribute("data-cfasync", "false");
                document.head.appendChild(tag);
              };
              const scheduleTag = () => {
                setTimeout(() => {
                  if ("requestIdleCallback" in window) {
                    window.requestIdleCallback(loadTag, { timeout: 2000 });
                    return;
                  }
                  loadTag();
                }, 1500);
              };
              if (document.readyState === "complete") scheduleTag();
              else window.addEventListener("load", scheduleTag, { once: true });
            })();`,
          }}
        />
      </head>
      <body>
        <a href="#main-content" className="skipLink">Skip to content</a>
        <SiteChrome position="header" />
        <main id="main-content">{children}</main>
        <SiteChrome position="footer" />
      </body>
    </html>
  );
}
