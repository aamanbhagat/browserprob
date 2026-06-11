"use client";
import { useState, useEffect } from "react";
import { detectFonts, type FontInfo } from "@/lib/detect/fonts";
import DataRow from "@/components/DataRow";
import ProbeAnimation from "@/components/ProbeAnimation";
import RelatedTools from "@/components/RelatedTools";
import styles from "../tools.module.css";

export default function FontDetectionPage() {
  const [data, setData] = useState<FontInfo | null>(null);
  useEffect(() => { const t = setTimeout(() => setData(detectFonts()), 800); return () => clearTimeout(t); }, []);
  if (!data) return <div className={styles.toolPage}><div className="container"><ProbeAnimation /></div></div>;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://browserprobe.app/tools/font-detection#webapp",
        "name": "Font Detection",
        "url": "https://browserprobe.app/tools/font-detection",
        "description": "Discover which system fonts are installed and detectable in your browser.",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Any"
      },
      {
        "@type": "FAQPage",
        "@id": "https://browserprobe.app/tools/font-detection#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How does a browser detect system fonts?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Browsers detect installed fonts by rendering text using a fallback font (like sans-serif) and comparing its dimensions (width/height) to the same text rendered with the target font. If the dimensions differ, the target font is present."
            }
          },
          {
            "@type": "Question",
            "name": "What is font fingerprinting?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Font fingerprinting is a tracking mechanism that utilizes the unique subset of fonts installed on your machine to build a persistent profile of your device. Custom fonts installed by users make their browser fingerprints even more unique."
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
      <div className={styles.header}><span className={styles.icon}>🔤</span><h1 className={styles.title}>Font Detection</h1><p className={styles.subtitle}>Discover which system fonts are detectable through your browser.</p></div>
      <div className={styles.resultsCard}>
        <div className={styles.resultsHeader}><span className={styles.resultsTitle}>Font Results</span><span className={styles.statusDot} /></div>
        <DataRow label="Fonts Detected" value={`${data.detectedFonts.length} / ${data.totalTested}`} />
        <DataRow label="Uniqueness Factor" value={data.detectedFonts.length > 20 ? "High" : data.detectedFonts.length > 10 ? "Medium" : "Low"} mono={false} />
      </div>
      <div className={styles.featureGrid}>
        {data.detectedFonts.map((font) => (
          <div key={font} className={styles.featureItem}>
            <span className={styles.featureName} style={{ fontFamily: `"${font}", sans-serif` }}>{font}</span>
            <span className={styles.featureYes}>✓</span>
          </div>
        ))}
      </div>
      <div className={styles.explainer}>
        <h2 className={styles.explainerTitle}>What This Means</h2>
        <p className={styles.explainerText}><strong>Font detection</strong> identifies which fonts are installed on your operating system by measuring how text renders in your browser. Different systems have different default fonts, making this a powerful fingerprinting vector.</p>
        <p className={styles.explainerText}>A Windows PC typically has fonts like Calibri and Segoe UI, while a Mac has Menlo and Helvetica. The specific combination of installed fonts can be highly unique, especially if you&apos;ve installed custom fonts.</p>
      </div>
      <RelatedTools currentSlug="font-detection" />
    </div></div>
  );
}
