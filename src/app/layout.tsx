import type { Metadata } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import { Atkinson_Hyperlegible, IBM_Plex_Mono, Schibsted_Grotesk } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ServiceWorkerCleanup from "@/components/ServiceWorkerCleanup";
import { ADS_ENABLED, ADSENSE_CLIENT, ADSENSE_SCRIPT_SRC } from "@/lib/ads";

const displayFace = Schibsted_Grotesk({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-display-face", display: "swap" });
// Atkinson Hyperlegible was designed for low-vision readability; next/font has fallback metrics for it, so the
// swap from the system font does not shift the layout.
const bodyFace = Atkinson_Hyperlegible({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-body-face", display: "swap" });
// Labels and values only; not needed for the first paint, so it is not preloaded.
const monoFace = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-mono-face", display: "swap", preload: false });

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
  // Google's AdSense site-ownership tag. It loads nothing; ads only load when NEXT_PUBLIC_ADS_ENABLED is set.
  other: { "google-adsense-account": ADSENSE_CLIENT },
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Reading request headers makes every page dynamic, which nonce-based CSP requires; without ads the
  // pages stay static.
  const nonce = ADS_ENABLED ? ((await headers()).get("x-nonce") ?? undefined) : undefined;

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
    <html lang="en" className={`${displayFace.variable} ${bodyFace.variable} ${monoFace.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </head>
      <body>
        <a href="#main-content" className="skipLink">Skip to content</a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <ServiceWorkerCleanup />
        {ADS_ENABLED && (
          <Script id="adsense-loader" src={ADSENSE_SCRIPT_SRC} strategy="afterInteractive" crossOrigin="anonymous" nonce={nonce} />
        )}
      </body>
    </html>
  );
}
