"use client";

import { useState, useEffect } from "react";
import { detectBrowser, type BrowserInfo } from "@/lib/detect/browser";
import DataRow from "@/components/DataRow";
import ProbeAnimation from "@/components/ProbeAnimation";
import RelatedTools from "@/components/RelatedTools";
import styles from "../tools.module.css";

export default function WhatIsMyBrowserPage() {
  const [info, setInfo] = useState<BrowserInfo | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setInfo(detectBrowser()), 800);
    return () => clearTimeout(timer);
  }, []);

  if (!info) return <div className={styles.toolPage}><div className="container"><ProbeAnimation /></div></div>;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://browserprobe.app/tools/what-is-my-browser#webapp",
        "name": "What Is My Browser?",
        "url": "https://browserprobe.app/tools/what-is-my-browser",
        "description": "Instantly detect your browser name, version, rendering engine, and full user agent string.",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Any"
      },
      {
        "@type": "FAQPage",
        "@id": "https://browserprobe.app/tools/what-is-my-browser#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is a web browser rendering engine?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A rendering engine is the core software that draws web pages on your screen. Major engines include Blink (Chrome, Edge, Opera), Gecko (Firefox), and WebKit (Safari)."
            }
          },
          {
            "@type": "Question",
            "name": "What is a User Agent string?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A User Agent string is a header sent by your browser to websites, identifying the browser name, version, operating system, and rendering engine to optimize compatibility."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className={styles.toolPage}>
      <div className="container">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <div className={styles.header}>
          <span className={styles.icon}>🌐</span>
          <h1 className={styles.title}>What Is My Browser?</h1>
          <p className={styles.subtitle}>
            Instantly detect your browser name, version, rendering engine, and
            full user agent string.
          </p>
        </div>

        <div className={styles.resultsCard}>
          <div className={styles.resultsHeader}>
            <span className={styles.resultsTitle}>Detection Results</span>
            <span className={styles.statusDot} />
          </div>
          <DataRow label="Browser" value={info.name} />
          <DataRow label="Version" value={info.version} />
          <DataRow label="Engine" value={info.engine} />
          <DataRow label="Engine Version" value={info.engineVersion} />
          <DataRow label="Platform" value={info.platform} />
          <DataRow label="Vendor" value={info.vendor} />
          <DataRow label="Language" value={info.language} />
          <DataRow label="Languages" value={info.languages} />
          <DataRow label="Online" value={info.online} />
          <DataRow label="Cookies Enabled" value={info.cookiesEnabled} />
          <DataRow label="User Agent" value={info.userAgent} />
        </div>

        <div className={styles.explainer}>
          <h2 className={styles.explainerTitle}>What This Means</h2>
          <p className={styles.explainerText}>
            Your <strong>browser name and version</strong> tell websites which
            software you&apos;re using to access the internet. This helps them
            deliver compatible content and features.
          </p>
          <p className={styles.explainerText}>
            The <strong>rendering engine</strong> (Blink, Gecko, or WebKit) is
            the core technology that draws web pages on your screen. Chrome and
            Edge use Blink, Firefox uses Gecko, and Safari uses WebKit.
          </p>
          <p className={styles.explainerText}>
            Your <strong>user agent string</strong> is a text identifier your
            browser sends with every web request. It contains your browser name,
            version, operating system, and sometimes device information.
            Websites use this to optimize their layout and functionality for
            your specific setup.
          </p>
        </div>

        <RelatedTools currentSlug="what-is-my-browser" />
      </div>
    </div>
  );
}
