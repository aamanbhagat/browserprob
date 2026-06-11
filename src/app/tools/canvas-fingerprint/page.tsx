"use client";
import { useState, useEffect } from "react";
import { detectCanvas, type CanvasInfo } from "@/lib/detect/canvas";
import DataRow from "@/components/DataRow";
import ProbeAnimation from "@/components/ProbeAnimation";
import RelatedTools from "@/components/RelatedTools";
import styles from "../tools.module.css";

export default function CanvasFingerprintPage() {
  const [data, setData] = useState<CanvasInfo | null>(null);
  useEffect(() => { const t = setTimeout(() => setData(detectCanvas()), 600); return () => clearTimeout(t); }, []);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://browserprobe.app/tools/canvas-fingerprint#webapp",
        "name": "Canvas Fingerprint Test",
        "url": "https://browserprobe.app/tools/canvas-fingerprint",
        "description": "Generate and view your unique canvas fingerprint hash.",
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
              "text": "Canvas fingerprinting is a browser tracking technique. It uses the HTML5 canvas element to draw a hidden graphic. Because different hardware, drivers, and OS environments draw text and images slightly differently, the pixel data forms a unique identifier (hash) that is specific to your device."
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

  if (!data) return <div className={styles.toolPage}><div className="container"><ProbeAnimation /></div></div>;

  return (
    <div className={styles.toolPage}>
      <div className="container">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      <div className={styles.header}><span className={styles.icon}>🎨</span><h1 className={styles.title}>Canvas Fingerprint Test</h1><p className={styles.subtitle}>View your unique canvas fingerprint that websites use for tracking.</p></div>
      <div className={styles.resultsCard}>
        <div className={styles.resultsHeader}><span className={styles.resultsTitle}>Canvas Fingerprint</span><span className={styles.statusDot} /></div>
        <DataRow label="Canvas Supported" value={data.supported} />
        <DataRow label="Fingerprint Hash" value={data.fingerprint} />
      </div>
      {data.dataUrl && (
        <div className={styles.visualBox}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={data.dataUrl} alt="Canvas fingerprint rendering" style={{ borderRadius: 8 }} />
        </div>
      )}
      <div className={styles.explainer}>
        <h2 className={styles.explainerTitle}>What This Means</h2>
        <p className={styles.explainerText}><strong>Canvas fingerprinting</strong> draws a hidden image using your browser&apos;s Canvas API. The resulting image varies slightly depending on your GPU, driver version, OS, and browser — creating a unique &quot;fingerprint&quot; that can identify your device.</p>
        <p className={styles.explainerText}>The image above was drawn by your browser. The <strong>hash</strong> is a compact representation of that image. Two devices with different hardware will almost certainly produce different hashes, even with the same browser.</p>
        <p className={styles.explainerText}>To block canvas fingerprinting, use the Brave browser (which adds randomness to canvas output) or install a Canvas Blocker extension.</p>
      </div>
      <RelatedTools currentSlug="canvas-fingerprint" />
    </div></div>
  );
}
