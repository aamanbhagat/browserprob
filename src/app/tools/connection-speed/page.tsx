"use client";
import { useState, useEffect } from "react";
import { detectNetwork, type NetworkInfo } from "@/lib/detect/network";
import DataRow from "@/components/DataRow";
import ToolLoading from "@/components/ToolLoading";
import RelatedTools from "@/components/RelatedTools";
import styles from "../tools.module.css";

export default function ConnectionSpeedPage() {
  const [data, setData] = useState<NetworkInfo | null>(null);
  useEffect(() => { const frame = requestAnimationFrame(() => setData(detectNetwork())); return () => cancelAnimationFrame(frame); }, []);
  if (!data) return <ToolLoading title="Connection Information" />;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://browserprobe.app/tools/connection-speed#webapp",
        "name": "Connection Information",
        "url": "https://browserprobe.app/tools/connection-speed",
        "description": "View your network connection type, speed estimate, and data saver status.",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Any"
      },
      {
        "@type": "FAQPage",
        "@id": "https://browserprobe.app/tools/connection-speed#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is the Network Information API?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The Network Information API provides web applications with access to the system's network connection type (such as cellular or Wi-Fi) and its performance metrics (like estimated bandwidth and round-trip latency)."
            }
          },
          {
            "@type": "Question",
            "name": "Why is my connection speed showing as 'Not available'?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The Network Information API is supported primarily in Chromium-based browsers (Chrome, Edge, Opera, Brave). It is not supported in Safari or Firefox due to fingerprinting and user privacy concerns."
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
      <div className={styles.header}><span className={styles.icon}>📶</span><h1 className={styles.title}>Connection Information</h1><p className={styles.subtitle}>View your network connection type, speed estimate, and data saver status.</p></div>
      <div className={styles.resultsCard}>
        <div className={styles.resultsHeader}><span className={styles.resultsTitle}>Network Info</span><span className={styles.statusDot} /></div>
        <DataRow label="Connection Type" value={data.effectiveType} />
        <DataRow label="Downlink Speed" value={data.downlink} />
        <DataRow label="Round-Trip Time" value={data.rtt} />
        <DataRow label="Data Saver" value={data.saveData} mono={false} />
        <DataRow label="Network Type" value={data.type} />
        <DataRow label="Online Status" value={data.online} />
      </div>
      <div className={styles.explainer}>
        <h2 className={styles.explainerTitle}>What This Means</h2>
        <p className={styles.explainerText}>The <strong>Network Information API</strong> provides details about your network connection. The <strong>effective type</strong> (4g, 3g, 2g, slow-2g) is an estimate based on recent performance measurements, not your actual connection technology.</p>
        <p className={styles.explainerText}><strong>Downlink speed</strong> shows the estimated bandwidth in Mbps. <strong>RTT</strong> (round-trip time) measures latency — lower is better for real-time applications like video calls and gaming.</p>
        <p className={styles.explainerText}>Note: This API is primarily available in Chromium-based browsers. Firefox and Safari have limited or no support.</p>
      </div>
      <RelatedTools currentSlug="connection-speed" />
    </div></div>
  );
}
