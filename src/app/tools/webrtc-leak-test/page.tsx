"use client";
import { useState, useEffect } from "react";
import { detectWebRTCLeak, type WebRTCLeak } from "@/lib/detect/privacy";
import DataRow from "@/components/DataRow";
import ProbeAnimation from "@/components/ProbeAnimation";
import RelatedTools from "@/components/RelatedTools";
import styles from "../tools.module.css";

export default function WebRTCLeakTestPage() {
  const [data, setData] = useState<WebRTCLeak | null>(null);
  useEffect(() => { detectWebRTCLeak().then(setData); }, []);
  if (!data) return <div className={styles.toolPage}><div className="container"><ProbeAnimation /></div></div>;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://browserprobe.app/tools/webrtc-leak-test#webapp",
        "name": "WebRTC Leak Test",
        "url": "https://browserprobe.app/tools/webrtc-leak-test",
        "description": "Check if your browser leaks your real IP address through WebRTC.",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Any"
      },
      {
        "@type": "FAQPage",
        "@id": "https://browserprobe.app/tools/webrtc-leak-test#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is a WebRTC IP leak?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A WebRTC leak occurs when a browser's WebRTC API exposes your real, underlying local and public IP addresses (via ICE candidates) directly to scripts on a web page, bypassing VPN proxy routing configurations."
            }
          },
          {
            "@type": "Question",
            "name": "How do I fix a WebRTC leak?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can resolve a WebRTC leak by using a privacy browser that blocks ICE candidate enumeration (like Brave), disabling WebRTC in browser configuration flags (e.g. setting 'media.peerconnection.enabled' to false in Firefox), or using WebRTC blocking browser extensions."
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
      <div className={styles.header}><span className={styles.icon}>🔓</span><h1 className={styles.title}>WebRTC Leak Test</h1><p className={styles.subtitle}>Check if your browser leaks your real IP address through WebRTC.</p></div>
      <div className={styles.resultsCard}>
        <div className={styles.resultsHeader}><span className={styles.resultsTitle}>WebRTC Results</span><span className={styles.statusDot} /></div>
        <DataRow label="WebRTC Supported" value={data.supported} />
        <DataRow label="IPs Detected" value={data.localIPs.length > 0 ? data.localIPs.join(", ") : "No IPs leaked"} />
        <DataRow label="Leak Status" value={data.localIPs.length > 0 ? "⚠️ Potential leak detected" : "✅ No leak detected"} mono={false} />
      </div>
      <div className={styles.explainer}>
        <h2 className={styles.explainerTitle}>What This Means</h2>
        <p className={styles.explainerText}><strong>WebRTC</strong> (Web Real-Time Communication) enables peer-to-peer connections for video calls and file sharing. However, it can inadvertently reveal your local and public IP addresses — even if you&apos;re using a VPN.</p>
        <p className={styles.explainerText}>If IPs were detected above, websites can potentially see your <strong>real IP address</strong> despite VPN or proxy use. This is known as a <strong>WebRTC leak</strong>.</p>
        <p className={styles.explainerText}>To prevent WebRTC leaks, you can disable WebRTC in your browser settings (Firefox: <code>media.peerconnection.enabled = false</code> in about:config) or use a browser extension like WebRTC Leak Prevent.</p>
      </div>
      <RelatedTools currentSlug="webrtc-leak-test" />
    </div></div>
  );
}
