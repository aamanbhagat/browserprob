"use client";
import { useState, useEffect } from "react";
import { detectHardware, type HardwareInfo } from "@/lib/detect/hardware";
import DataRow from "@/components/DataRow";
import ProbeAnimation from "@/components/ProbeAnimation";
import RelatedTools from "@/components/RelatedTools";
import styles from "../tools.module.css";

export default function HardwareInfoPage() {
  const [data, setData] = useState<HardwareInfo | null>(null);
  useEffect(() => { detectHardware().then(setData); }, []);
  if (!data) return <div className={styles.toolPage}><div className="container"><ProbeAnimation /></div></div>;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://browserprobe.app/tools/hardware-info#webapp",
        "name": "Hardware Information",
        "url": "https://browserprobe.app/tools/hardware-info",
        "description": "Check your device hardware through your browser: CPU cores, device memory, battery status, and GPU information.",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Any"
      },
      {
        "@type": "FAQPage",
        "@id": "https://browserprobe.app/tools/hardware-info#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How does a browser know my CPU cores and RAM?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Browsers access hardware information through properties like 'navigator.hardwareConcurrency' (logical processor cores) and 'navigator.deviceMemory' (approximate RAM capacity in gigabytes) to help developers tailor web performance."
            }
          },
          {
            "@type": "Question",
            "name": "Why is the Battery Status API considered a privacy risk?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The Battery Status API was found to be a tracking risk because a device's precise battery level (e.g. 84.13%) and remaining charging time could be used as a short-term identifier to link sessions across different domains."
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
      <div className={styles.header}><span className={styles.icon}>🖲️</span><h1 className={styles.title}>Hardware Information</h1><p className={styles.subtitle}>Detect your CPU cores, device memory, battery status, and GPU details.</p></div>
      <div className={styles.resultsCard}>
        <div className={styles.resultsHeader}><span className={styles.resultsTitle}>Hardware Details</span><span className={styles.statusDot} /></div>
        <DataRow label="CPU Cores" value={data.cpuCores > 0 ? data.cpuCores : null} />
        <DataRow label="Device Memory" value={data.deviceMemory} />
        <DataRow label="GPU" value={data.gpu} />
        <DataRow label="Platform" value={data.platform} />
        <DataRow label="Touch Points" value={data.maxTouchPoints} />
        <DataRow label="Battery Status" value={data.batteryStatus} mono={false} />
        <DataRow label="Battery Level" value={data.batteryLevel} />
        <DataRow label="Charging" value={data.batteryCharging} mono={false} />
      </div>
      <div className={styles.explainer}>
        <h2 className={styles.explainerTitle}>What This Means</h2>
        <p className={styles.explainerText}><strong>CPU cores</strong> (navigator.hardwareConcurrency) reveals how many logical processor cores your device has. This helps websites optimize performance-intensive tasks but also contributes to fingerprinting.</p>
        <p className={styles.explainerText}><strong>Device memory</strong> shows approximately how much RAM your device has. This API is designed to help websites serve lighter or heavier content based on device capability.</p>
        <p className={styles.explainerText}>The <strong>Battery API</strong> was deprecated in Firefox due to privacy concerns — it could be used to track users by correlating battery level and charging state across websites.</p>
      </div>
      <RelatedTools currentSlug="hardware-info" />
    </div></div>
  );
}
