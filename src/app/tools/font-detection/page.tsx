"use client";
import { useState, useEffect } from "react";
import { detectFonts, type FontInfo } from "@/lib/detect/fonts";
import DataRow from "@/components/DataRow";
import ToolLoading from "@/components/ToolLoading";
import RelatedTools from "@/components/RelatedTools";
import styles from "../tools.module.css";

export default function FontDetectionPage() {
  const [data, setData] = useState<FontInfo | null>(null);
  useEffect(() => { const frame = requestAnimationFrame(() => setData(detectFonts())); return () => cancelAnimationFrame(frame); }, []);
  if (!data) return <ToolLoading title="Font Detection" />;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://browserprobe.app/tools/font-detection#webapp",
        "name": "Font Detection",
        "url": "https://browserprobe.app/tools/font-detection",
        "description": "Estimate which tested font names are distinguishable through browser text metrics.",
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
              "text": "Font fingerprinting tests which font names appear available and combines the pattern with other browser signals. The result can narrow a population, but one font list does not prove a visitor's identity or uniqueness."
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
      <div className={styles.header}><span className={styles.icon}>🔤</span><h1 className={styles.title}>Font Detection</h1><p className={styles.subtitle}>Discover which system fonts are detectable through your browser.</p></div>
      <div className={styles.resultsCard}>
        <div className={styles.resultsHeader}><span className={styles.resultsTitle}>Font Results</span><span className={styles.statusDot} /></div>
        <DataRow label="Fonts Detected" value={`${data.detectedFonts.length} / ${data.totalTested}`} />
        <DataRow label="Method" value="Text-metric comparison" mono={false} />
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
        <p className={styles.explainerText}><strong>Font detection</strong> estimates which font names are available by comparing rendered text dimensions with fallback fonts. Browser font substitution can produce false positives or negatives.</p>
        <p className={styles.explainerText}>Operating systems ship different font sets, and custom fonts can make a list less common. This result is one observable signal; BrowserProbe does not assign an unsupported uniqueness score.</p>
      </div>
      <RelatedTools currentSlug="font-detection" />
    </div></div>
  );
}
