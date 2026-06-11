"use client";
import { useState, useEffect } from "react";
import DataRow from "@/components/DataRow";
import ProbeAnimation from "@/components/ProbeAnimation";
import RelatedTools from "@/components/RelatedTools";
import styles from "../tools.module.css";

export default function TimezoneLocalePage() {
  const [data, setData] = useState<Record<string, string> | null>(null);
  useEffect(() => {
    const t = setTimeout(() => {
      const tz = Intl.DateTimeFormat().resolvedOptions();
      const now = new Date();
      const offset = now.getTimezoneOffset();
      const offsetHours = Math.abs(Math.floor(offset / 60));
      const offsetMins = Math.abs(offset % 60);
      const sign = offset <= 0 ? "+" : "-";
      setData({
        timezone: tz.timeZone || "Unknown",
        locale: tz.locale || navigator.language,
        utcOffset: `UTC${sign}${String(offsetHours).padStart(2, "0")}:${String(offsetMins).padStart(2, "0")}`,
        language: navigator.language,
        languages: navigator.languages?.join(", ") || navigator.language,
        dateFormat: now.toLocaleDateString(),
        timeFormat: now.toLocaleTimeString(),
        calendar: tz.calendar || "gregory",
        numberingSystem: tz.numberingSystem || "latn",
        localTime: now.toString(),
      });
    }, 600);
    return () => clearTimeout(t);
  }, []);
  if (!data) return <div className={styles.toolPage}><div className="container"><ProbeAnimation /></div></div>;
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
              "text": "Timezone fingerprinting tracks devices by reading their local timezone settings (via JavaScript's Intl API). Since timezones narrow down your geographic region, it is a key component of building a unique browser fingerprint."
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
      <div className={styles.header}><span className={styles.icon}>🕐</span><h1 className={styles.title}>Timezone & Locale</h1><p className={styles.subtitle}>Detect your timezone, language preferences, and locale settings.</p></div>
      <div className={styles.resultsCard}>
        <div className={styles.resultsHeader}><span className={styles.resultsTitle}>Locale Info</span><span className={styles.statusDot} /></div>
        <DataRow label="Timezone" value={data.timezone} />
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
        <p className={styles.explainerText}>Your <strong>timezone</strong> reveals your approximate geographic location. Combined with your language preferences, it can narrow down your location to a specific country or region.</p>
        <p className={styles.explainerText}>The <strong>Intl API</strong> provides locale-aware formatting for dates, numbers, and currencies. The specific locale, calendar system, and numbering system your browser uses all contribute to your digital fingerprint.</p>
        <p className={styles.explainerText}>Websites use this information to serve localized content, adjust timestamps, and personalize the experience — but it also makes you more identifiable.</p>
      </div>
      <RelatedTools currentSlug="timezone-locale" />
    </div></div>
  );
}
