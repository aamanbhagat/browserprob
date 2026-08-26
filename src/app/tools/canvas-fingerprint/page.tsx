"use client";
import { useState, useEffect } from "react";
import { detectCanvas, type CanvasInfo } from "@/lib/detect/canvas";
import DataRow from "@/components/DataRow";
import ToolLoading from "@/components/ToolLoading";
import RelatedTools from "@/components/RelatedTools";
import styles from "../tools.module.css";

export default function CanvasFingerprintPage() {
  const [data, setData] = useState<CanvasInfo | null>(null);
  useEffect(() => { const frame = requestAnimationFrame(() => setData(detectCanvas())); return () => cancelAnimationFrame(frame); }, []);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://browserprobe.app/tools/canvas-fingerprint#webapp",
        "name": "Canvas Fingerprint Test",
        "url": "https://browserprobe.app/tools/canvas-fingerprint",
        "description": "Generate a stable identifier for one canvas rendering sample.",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Any"
      },
      {
        "@type": "FAQPage",
        "@id": "https://browserprobe.app/tools/canvas-fingerprint#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is canvas fingerprinting?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Canvas fingerprinting draws a graphic and records the resulting pixels. Hardware, fonts, software, and privacy settings can influence the output, so the result may contribute one signal to a broader browser fingerprint. A single sample does not prove uniqueness."
            }
          },
          {
            "@type": "Question",
            "name": "How do I defend against canvas fingerprinting?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can protect against canvas fingerprinting by using a browser that adds slight noise/randomness to canvas pixel reads (like Brave or Firefox with privacy.resistFingerprinting enabled), or by using specific browser extensions like Canvas Blocker."
            }
          }
        ]
      }
    ]
  };

  if (!data) return <ToolLoading title="Canvas Fingerprint Test" />;

  return (
    <div className={styles.toolPage}>
      <div className="container">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
        />
      <div className={styles.header}><span className={styles.icon}>🎨</span><h1 className={styles.title}>Canvas Fingerprint Test</h1><p className={styles.subtitle}>Generate a reproducible canvas sample for this browser session.</p></div>
      <div className={styles.resultsCard}>
        <div className={styles.resultsHeader}><span className={styles.resultsTitle}>Canvas Fingerprint</span><span className={styles.statusDot} /></div>
        <DataRow label="Canvas Supported" value={data.supported} />
        <DataRow label="Sample ID" value={data.fingerprint} />
      </div>
      {data.dataUrl && (
        <div className={styles.visualBox}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={data.dataUrl} alt="Canvas fingerprint rendering" style={{ borderRadius: 8 }} />
        </div>
      )}
      <div className={styles.explainer}>
        <h2 className={styles.explainerTitle}>What This Means</h2>
        <p className={styles.explainerText}><strong>Canvas fingerprinting</strong> draws an image using the Canvas API. Rendering can vary with the graphics stack, fonts, operating system, and browser settings, producing a signal that can be combined with other data.</p>
        <p className={styles.explainerText}>The <strong>sample hash</strong> is a compact identifier for this drawing. Matching hashes do not prove two visitors are the same, and a single sample cannot prove that your browser is unique across the web.</p>
        <p className={styles.explainerText}>Privacy-focused browsers may standardize or randomize canvas reads. Extensions can also change behavior, but they may introduce a less common configuration of their own.</p>
      </div>
      <RelatedTools currentSlug="canvas-fingerprint" />
    </div></div>
  );
}
