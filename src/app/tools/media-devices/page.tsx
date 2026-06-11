"use client";
import { useState, useEffect } from "react";
import DataRow from "@/components/DataRow";
import ProbeAnimation from "@/components/ProbeAnimation";
import RelatedTools from "@/components/RelatedTools";
import styles from "../tools.module.css";

export default function MediaDevicesPage() {
  const [data, setData] = useState<{ supported: boolean; devices: { kind: string; label: string }[] } | null>(null);
  useEffect(() => {
    (async () => {
      if (!navigator.mediaDevices?.enumerateDevices) {
        setData({ supported: false, devices: [] });
        return;
      }
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        setData({ supported: true, devices: devices.map(d => ({ kind: d.kind, label: d.label || `${d.kind} (permission required)` })) });
      } catch {
        setData({ supported: false, devices: [] });
      }
    })();
  }, []);
  if (!data) return <div className={styles.toolPage}><div className="container"><ProbeAnimation /></div></div>;
  const audioin = data.devices.filter(d => d.kind === "audioinput");
  const audioout = data.devices.filter(d => d.kind === "audiooutput");
  const videoin = data.devices.filter(d => d.kind === "videoinput");
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://browserprobe.app/tools/media-devices#webapp",
        "name": "Media Devices Detection",
        "url": "https://browserprobe.app/tools/media-devices",
        "description": "Detect available media devices (cameras, microphones, speakers) in your browser without accessing them.",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Any"
      },
      {
        "@type": "FAQPage",
        "@id": "https://browserprobe.app/tools/media-devices#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Can websites access my camera and microphone without permission?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. Modern browser security requires explicit user consent before a website can access audio/video streams from your webcam or microphone. The MediaDevices API only lets websites list the counts and device types."
            }
          },
          {
            "@type": "Question",
            "name": "How is media device listing used for browser fingerprinting?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The counts, order, and identifiers of your input/output devices (e.g. 2 microphones, 1 camera, 3 audio output routes) form a hardware signature that helps websites uniquely identify your browser setup."
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
      <div className={styles.header}><span className={styles.icon}>📹</span><h1 className={styles.title}>Media Devices Detection</h1><p className={styles.subtitle}>Check available cameras, microphones, and audio output devices.</p></div>
      <div className={styles.resultsCard}>
        <div className={styles.resultsHeader}><span className={styles.resultsTitle}>Media Devices</span><span className={styles.statusDot} /></div>
        <DataRow label="MediaDevices API" value={data.supported} />
        <DataRow label="Total Devices" value={data.devices.length} />
        <DataRow label="Microphones" value={audioin.length} />
        <DataRow label="Speakers" value={audioout.length} />
        <DataRow label="Cameras" value={videoin.length} />
        {data.devices.map((d, i) => <DataRow key={i} label={d.kind} value={d.label} />)}
      </div>
      <div className={styles.explainer}>
        <h2 className={styles.explainerTitle}>What This Means</h2>
        <p className={styles.explainerText}>The <strong>MediaDevices API</strong> allows websites to enumerate available audio/video devices without requesting permission to use them. The number and types of devices can contribute to your browser fingerprint.</p>
        <p className={styles.explainerText}>Device labels are only revealed after you grant camera/microphone permission. Before permission, you&apos;ll see generic labels. The count of devices alone can be identifying — most laptops have exactly 1 camera and 1 microphone.</p>
      </div>
      <RelatedTools currentSlug="media-devices" />
    </div></div>
  );
}
