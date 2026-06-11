"use client";
import { useState, useEffect } from "react";
import { detectPrivacy, type PrivacyInfo } from "@/lib/detect/privacy";
import DataRow from "@/components/DataRow";
import ProbeAnimation from "@/components/ProbeAnimation";
import RelatedTools from "@/components/RelatedTools";
import styles from "../tools.module.css";

export default function DoNotTrackPage() {
  const [data, setData] = useState<PrivacyInfo | null>(null);
  useEffect(() => { const t = setTimeout(() => setData(detectPrivacy()), 600); return () => clearTimeout(t); }, []);
  if (!data) return <div className={styles.toolPage}><div className="container"><ProbeAnimation /></div></div>;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://browserprobe.app/tools/do-not-track#webapp",
        "name": "Do Not Track Test",
        "url": "https://browserprobe.app/tools/do-not-track",
        "description": "Check if Do Not Track and Global Privacy Control are enabled.",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Any"
      },
      {
        "@type": "FAQPage",
        "@id": "https://browserprobe.app/tools/do-not-track#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is the difference between Do Not Track (DNT) and Global Privacy Control (GPC)?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Do Not Track (DNT) is a voluntary header signal that is largely ignored by advertisers. Global Privacy Control (GPC) is a modern successor designed to have legally binding authority under privacy frameworks like CCPA (California) and GDPR (Europe), obligating websites to limit data sales."
            }
          },
          {
            "@type": "Question",
            "name": "How do I turn on Global Privacy Control?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can turn on GPC by using a browser that has it enabled natively (like Brave, Firefox, or DuckDuckGo) or by installing privacy-focused extensions like Privacy Badger."
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
      <div className={styles.header}><span className={styles.icon}>🛡️</span><h1 className={styles.title}>Do Not Track Test</h1><p className={styles.subtitle}>Check if Do Not Track and Global Privacy Control are enabled in your browser.</p></div>
      <div className={styles.resultsCard}>
        <div className={styles.resultsHeader}><span className={styles.resultsTitle}>Privacy Settings</span><span className={styles.statusDot} /></div>
        <DataRow label="Do Not Track (DNT)" value={data.doNotTrack} mono={false} />
        <DataRow label="Global Privacy Control" value={data.globalPrivacyControl} mono={false} />
        <DataRow label="Cookies Enabled" value={data.cookiesEnabled} />
      </div>
      <div className={styles.explainer}>
        <h2 className={styles.explainerTitle}>What This Means</h2>
        <p className={styles.explainerText}><strong>Do Not Track (DNT)</strong> is a browser setting that sends a signal to websites requesting they don&apos;t track your activity. However, DNT is purely voluntary — most websites ignore it entirely. Major browsers have been phasing out support for DNT.</p>
        <p className={styles.explainerText}><strong>Global Privacy Control (GPC)</strong> is the successor to DNT. Unlike DNT, GPC has legal backing under regulations like the CCPA (California Consumer Privacy Act) and GDPR. Websites are legally required to honor GPC signals in certain jurisdictions.</p>
        <p className={styles.explainerText}>To enable GPC, use browsers like Firefox, Brave, or DuckDuckGo — or install the Privacy Badger extension.</p>
      </div>
      <RelatedTools currentSlug="do-not-track" />
    </div></div>
  );
}
