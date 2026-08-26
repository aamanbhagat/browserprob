"use client";
import { useState, useEffect } from "react";
import DataRow from "@/components/DataRow";
import ToolLoading from "@/components/ToolLoading";
import RelatedTools from "@/components/RelatedTools";
import { detectTimezone, type TimezoneInfo } from "@/lib/detect/timezone";
import styles from "../tools.module.css";

interface TimezonePageData extends TimezoneInfo {
  dateFormat: string;
  timeFormat: string;
  calendar: string;
  numberingSystem: string;
}

export default function TimezoneLocalePage() {
  const [data, setData] = useState<TimezonePageData | null>(null);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const tz = Intl.DateTimeFormat().resolvedOptions();
      const now = new Date();
      const detected = detectTimezone(now);
      setData({
        ...detected,
        dateFormat: now.toLocaleDateString(),
        timeFormat: now.toLocaleTimeString(),
        calendar: tz.calendar || "gregory",
        numberingSystem: tz.numberingSystem || "latn",
      });
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  if (!data) return <ToolLoading title="Timezone & Locale" />;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://browserprobe.app/tools/timezone-locale#webapp",
        "name": "Timezone & Locale",
        "url": "https://browserprobe.app/tools/timezone-locale",
        "description": "Check your browser timezone, locale, language preferences, and date formatting.",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Any"
      },
      {
        "@type": "FAQPage",
        "@id": "https://browserprobe.app/tools/timezone-locale#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Can a VPN change my browser timezone?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A standard VPN encrypts your network traffic and changes your public IP address, but it does not change your system clock or browser timezone settings. Websites can detect a discrepancy between your VPN IP location and browser timezone, which is a common indicator of proxy usage."
            }
          },
          {
            "@type": "Question",
            "name": "What is timezone fingerprinting?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A site can read the browser timezone through the Intl API. A timezone may narrow a broad region and contribute to a larger fingerprint, but many people share it and it does not prove location or identity."
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
        />
      <div className={styles.header}><span className={styles.icon}>🕐</span><h1 className={styles.title}>Timezone & Locale</h1><p className={styles.subtitle}>Detect your timezone, language preferences, and locale settings.</p></div>
      <div className={styles.resultsCard}>
        <div className={styles.resultsHeader}><span className={styles.resultsTitle}>Locale Info</span><span className={styles.statusDot} /></div>
        <DataRow label="Timezone" value={data.timezone} />
        {data.reportedTimezone !== data.timezone && <DataRow label="Browser Alias" value={data.reportedTimezone} />}
        <DataRow label="UTC Offset" value={data.utcOffset} />
        <DataRow label="Locale" value={data.locale} />
        <DataRow label="Primary Language" value={data.language} />
        <DataRow label="All Languages" value={data.languages} />
        <DataRow label="Date Format" value={data.dateFormat} />
        <DataRow label="Time Format" value={data.timeFormat} />
        <DataRow label="Calendar" value={data.calendar} />
        <DataRow label="Numbering System" value={data.numberingSystem} />
        <DataRow label="Local Time" value={data.localTime} />
      </div>
      <div className={styles.explainer}>
        <h2 className={styles.explainerTitle}>What This Means</h2>
        <p className={styles.explainerText}>Your <strong>timezone</strong> can suggest a broad geographic region, but it does not prove your physical location. Multiple regions can share an offset, and the setting can be changed or spoofed.</p>
        <p className={styles.explainerText}>The <strong>Intl API</strong> provides locale-aware formatting for dates, numbers, and currencies. The specific locale, calendar system, and numbering system your browser uses all contribute to your digital fingerprint.</p>
        <p className={styles.explainerText}>Websites use this information to serve localized content, adjust timestamps, and personalize the experience — but it also makes you more identifiable.</p>
      </div>
      <RelatedTools currentSlug="timezone-locale" />
    </div></div>
  );
}
