"use client";
import { useState, useEffect } from "react";
import DataRow from "@/components/DataRow";
import ProbeAnimation from "@/components/ProbeAnimation";
import RelatedTools from "@/components/RelatedTools";
import styles from "../tools.module.css";

export default function BrowserPluginsPage() {
  const [data, setData] = useState<{ plugins: string[]; mimeTypes: number; pdfViewer: boolean } | null>(null);
  useEffect(() => {
    const t = setTimeout(() => {
      const plugins: string[] = [];
      for (let i = 0; i < navigator.plugins.length; i++) plugins.push(navigator.plugins[i].name);
      setData({ plugins, mimeTypes: navigator.mimeTypes.length, pdfViewer: navigator.pdfViewerEnabled ?? plugins.some(p => p.toLowerCase().includes("pdf")) });
    }, 600);
    return () => clearTimeout(t);
  }, []);
  if (!data) return <div className={styles.toolPage}><div className="container"><ProbeAnimation /></div></div>;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://browserprobe.app/tools/browser-plugins#webapp",
        "name": "Browser Plugins & Extensions",
        "url": "https://browserprobe.app/tools/browser-plugins",
        "description": "List detected browser plugins, MIME types, and PDF viewer support.",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Any"
      },
      {
        "@type": "FAQPage",
        "@id": "https://browserprobe.app/tools/browser-plugins#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Why does the list of browser plugins matter for privacy?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The Navigator.plugins array exposes installed browser plugins and helper applications (such as PDF viewers). Even if most plugins are deprecated today, the specific list, count, and order of these plugins can act as a tracking identifier."
            }
          },
          {
            "@type": "Question",
            "name": "Can websites see all of my browser extensions?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Websites cannot directly read your list of installed extensions (like adblockers or password managers) due to security constraints. However, they can infer their presence by observing modified DOM elements, blocked network requests, or injected extension stylesheets."
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
      <div className={styles.header}><span className={styles.icon}>🧩</span><h1 className={styles.title}>Browser Plugins & Extensions</h1><p className={styles.subtitle}>List detected browser plugins, MIME types, and PDF viewer support.</p></div>
      <div className={styles.resultsCard}>
        <div className={styles.resultsHeader}><span className={styles.resultsTitle}>Plugin Results</span><span className={styles.statusDot} /></div>
        <DataRow label="Plugins Detected" value={data.plugins.length} />
        <DataRow label="MIME Types" value={data.mimeTypes} />
        <DataRow label="PDF Viewer" value={data.pdfViewer} />
        {data.plugins.map((p, i) => <DataRow key={i} label={`Plugin ${i + 1}`} value={p} />)}
      </div>
      <div className={styles.explainer}>
        <h2 className={styles.explainerTitle}>What This Means</h2>
        <p className={styles.explainerText}>Modern browsers have significantly reduced the <strong>plugins</strong> API surface for privacy reasons. Most browsers now report minimal or no plugins. However, the PDF viewer status and the specific list of plugins can still contribute to your fingerprint.</p>
        <p className={styles.explainerText}><strong>MIME types</strong> are content types your browser claims to support (like video/mp4 or application/pdf). The exact list varies by browser and OS.</p>
      </div>
      <RelatedTools currentSlug="browser-plugins" />
    </div></div>
  );
}
