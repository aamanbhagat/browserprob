import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://browserprobe.app"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  title: {
    default: "BrowserProbe — Free Browser Diagnostics & Privacy Tools",
    template: "%s | BrowserProbe",
  },
  description:
    "Probe your browser to discover what websites can see. Free tools for browser detection, fingerprinting tests, privacy leak checks, and hardware diagnostics.",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://browserprobe.app",
    siteName: "BrowserProbe",
    title: "BrowserProbe — Free Browser Diagnostics & Privacy Tools",
    description:
      "Probe your browser to discover what websites can see. Free tools for browser detection, fingerprinting, privacy checks, and more.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BrowserProbe — Free Browser Diagnostics & Privacy Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BrowserProbe — Free Browser Diagnostics & Privacy Tools",
    description:
      "Probe your browser to discover what websites can see. Free tools for browser detection, fingerprinting, privacy checks, and more.",
    images: ["/og-image.png"],
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
      "Free browser diagnostics and privacy tools. Discover what websites can see about your browser, device, and network.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
        {/* Google Analytics Tag */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VSS6DZES93"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VSS6DZES93');
          `}
        </Script>

        {/* Ad Tag 1 */}
        <Script
          src="https://5gvci.com/act/files/tag.min.js?z=11134976"
          strategy="afterInteractive"
          data-cfasync="false"
        />

        {/* Ad Tag 2 */}
        <Script id="ad-tag-2" strategy="afterInteractive">
          {`(function(s){s.dataset.zone='11134981',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`}
        </Script>

        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
