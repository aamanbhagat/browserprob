"use client";
import { useState, useEffect } from "react";
import DataRow from "@/components/DataRow";
import ProbeAnimation from "@/components/ProbeAnimation";
import RelatedTools from "@/components/RelatedTools";
import styles from "../tools.module.css";

export default function CookiesTestPage() {
  const [data, setData] = useState<Record<string, string | boolean> | null>(null);
  useEffect(() => {
    const t = setTimeout(() => {
      const enabled = navigator.cookieEnabled;
      let storageAvailable = false;
      try { localStorage.setItem("_bp_test", "1"); localStorage.removeItem("_bp_test"); storageAvailable = true; } catch { /* */ }
      let sessionStorage = false;
      try { window.sessionStorage.setItem("_bp_test", "1"); window.sessionStorage.removeItem("_bp_test"); sessionStorage = true; } catch { /* */ }
      setData({ cookiesEnabled: enabled, localStorage: storageAvailable, sessionStorage, indexedDB: typeof indexedDB !== "undefined" });
    }, 600);
    return () => clearTimeout(t);
  }, []);
  if (!data) return <div className={styles.toolPage}><div className="container"><ProbeAnimation /></div></div>;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://browserprobe.app/tools/cookies-test#webapp",
        "name": "Cookies Test",
        "url": "https://browserprobe.app/tools/cookies-test",
        "description": "Test if your browser accepts cookies and check cookie storage limits.",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Any"
      },
      {
        "@type": "FAQPage",
        "@id": "https://browserprobe.app/tools/cookies-test#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is the difference between browser cookies and local storage?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Cookies are sent back and forth between the client and server with every HTTP request (making them ideal for session tokens), while Web Storage APIs like LocalStorage and SessionStorage reside entirely client-side and can hold much larger volumes of data without impact on network performance."
            }
          },
          {
            "@type": "Question",
            "name": "What are third-party cookies?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Third-party cookies are cookies set by a domain other than the website you are currently visiting (often ad trackers or analytics scripts). Many modern browsers block third-party cookies by default to safeguard user privacy."
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
      <div className={styles.header}><span className={styles.icon}>🍪</span><h1 className={styles.title}>Cookies Test</h1><p className={styles.subtitle}>Check if your browser accepts cookies and supports web storage.</p></div>
      <div className={styles.resultsCard}>
        <div className={styles.resultsHeader}><span className={styles.resultsTitle}>Storage Results</span><span className={styles.statusDot} /></div>
        <DataRow label="Cookies Enabled" value={data.cookiesEnabled} />
        <DataRow label="LocalStorage" value={data.localStorage} />
        <DataRow label="SessionStorage" value={data.sessionStorage} />
        <DataRow label="IndexedDB" value={data.indexedDB} />
      </div>
      <div className={styles.explainer}>
        <h2 className={styles.explainerTitle}>What This Means</h2>
        <p className={styles.explainerText}><strong>Cookies</strong> are small text files websites store in your browser to remember your preferences, login sessions, and tracking data. Disabling cookies can break some website functionality.</p>
        <p className={styles.explainerText}><strong>LocalStorage</strong> and <strong>SessionStorage</strong> are newer web storage APIs that let websites store data directly in your browser. LocalStorage persists until cleared, while SessionStorage is erased when you close the tab.</p>
        <p className={styles.explainerText}><strong>IndexedDB</strong> is a powerful client-side database that allows websites to store large amounts of structured data. It&apos;s used by modern web apps for offline functionality.</p>
      </div>
      <RelatedTools currentSlug="cookies-test" />
    </div></div>
  );
}
