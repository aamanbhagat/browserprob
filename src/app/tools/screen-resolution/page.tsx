"use client";
import { useState, useEffect } from "react";
import { detectScreen, type ScreenInfo } from "@/lib/detect/screen";
import DataRow from "@/components/DataRow";
import ToolLoading from "@/components/ToolLoading";
import RelatedTools from "@/components/RelatedTools";
import styles from "../tools.module.css";

export default function ScreenResolutionPage() {
  const [info, setInfo] = useState<ScreenInfo | null>(null);
  useEffect(() => { const frame = requestAnimationFrame(() => setInfo(detectScreen())); return () => cancelAnimationFrame(frame); }, []);
  if (!info) return <ToolLoading title="Screen Resolution Test" />;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://browserprobe.app/tools/screen-resolution#webapp",
        "name": "Screen Resolution Test",
        "url": "https://browserprobe.app/tools/screen-resolution",
        "description": "Check your screen resolution, viewport size, pixel ratio, and display info.",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Any"
      },
      {
        "@type": "FAQPage",
        "@id": "https://browserprobe.app/tools/screen-resolution#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is the difference between screen size and viewport size?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Screen size is the total physical resolution of your monitor, whereas viewport size is the actual area within the browser window that displays the web page (excluding address bars and bookmarks bars)."
            }
          },
          {
            "@type": "Question",
            "name": "What is Device Pixel Ratio (DPR)?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Device Pixel Ratio (DPR) is the ratio between physical pixels and logical (CSS) pixels. High-density screens (like Retina displays) have a DPR of 2 or 3, meaning they use multiple physical pixels to draw a single logical pixel for sharper visuals."
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
      <div className={styles.header}>
        <span className={styles.icon}>🖥️</span>
        <h1 className={styles.title}>Screen Resolution Test</h1>
        <p className={styles.subtitle}>Detailed information about your display, viewport, and pixel density.</p>
      </div>
      <div className={styles.resultsCard}>
        <div className={styles.resultsHeader}><span className={styles.resultsTitle}>Display Info</span><span className={styles.statusDot} /></div>
        <DataRow label="Screen Resolution" value={`${info.screenWidth} × ${info.screenHeight}`} />
        <DataRow label="Viewport Size" value={`${info.viewportWidth} × ${info.viewportHeight}`} />
        <DataRow label="Device Pixel Ratio" value={info.devicePixelRatio} />
        <DataRow label="Color Depth" value={`${info.colorDepth}-bit`} />
        <DataRow label="Pixel Depth" value={`${info.pixelDepth}-bit`} />
        <DataRow label="Orientation" value={info.orientation} />
        <DataRow label="Touch Support" value={info.touchSupport} />
        <DataRow label="Max Touch Points" value={info.maxTouchPoints} />
      </div>
      <div className={styles.explainer}>
        <h2 className={styles.explainerTitle}>What This Means</h2>
        <p className={styles.explainerText}><strong>Screen resolution</strong> is the total number of pixels your monitor can display. Higher resolutions mean sharper images and more screen space.</p>
        <p className={styles.explainerText}>The <strong>device pixel ratio</strong> (DPR) indicates how many physical pixels make up one CSS pixel. A DPR of 2 means you have a &quot;Retina&quot; or HiDPI display where each CSS pixel is rendered with 4 physical pixels (2×2).</p>
        <p className={styles.explainerText}><strong>Viewport size</strong> is the actual visible area of your browser window. This is what responsive websites use to determine their layout — it&apos;s smaller than your screen resolution because it excludes browser chrome (toolbars, scrollbars).</p>
      </div>
      <RelatedTools currentSlug="screen-resolution" />
    </div></div>
  );
}
