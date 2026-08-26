"use client";
import { useState, useEffect } from "react";
import { detectAudio, type AudioInfo } from "@/lib/detect/audio";
import DataRow from "@/components/DataRow";
import ToolLoading from "@/components/ToolLoading";
import RelatedTools from "@/components/RelatedTools";
import styles from "../tools.module.css";

export default function AudioFingerprintPage() {
  const [data, setData] = useState<AudioInfo | null>(null);
  useEffect(() => { detectAudio().then(setData); }, []);
  if (!data) return <ToolLoading title="Audio Fingerprint Test" />;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://browserprobe.app/tools/audio-fingerprint#webapp",
        "name": "Audio Fingerprint Test",
        "url": "https://browserprobe.app/tools/audio-fingerprint",
        "description": "Generate a stable identifier for one Web Audio rendering sample.",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Any"
      },
      {
        "@type": "FAQPage",
        "@id": "https://browserprobe.app/tools/audio-fingerprint#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is an audio fingerprint?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "An audio fingerprinting sample processes a known signal with the Web Audio API and summarizes the rendered buffer. Browser, operating-system, and processing differences may affect the output, which can contribute one signal to a broader fingerprint."
            }
          },
          {
            "@type": "Question",
            "name": "Does audio fingerprinting play actual sound?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. Audio fingerprinting is performed silently using an OfflineAudioContext, meaning the audio buffer is processed entirely in memory without routing any sound to your computer's speakers."
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
      <div className={styles.header}><span className={styles.icon}>🔊</span><h1 className={styles.title}>Audio Fingerprint Test</h1><p className={styles.subtitle}>Generate a repeatable Web Audio rendering sample in this browser.</p></div>
      <div className={styles.resultsCard}>
        <div className={styles.resultsHeader}><span className={styles.resultsTitle}>Audio Results</span><span className={styles.statusDot} /></div>
        <DataRow label="AudioContext Supported" value={data.supported} />
        <DataRow label="Sample ID" value={data.fingerprint} />
        <DataRow label="Sample Rate" value={data.sampleRate > 0 ? `${data.sampleRate} Hz` : "N/A"} />
        <DataRow label="Max Channels" value={data.channelCount > 0 ? data.channelCount : "N/A"} />
      </div>
      <div className={styles.explainer}>
        <h2 className={styles.explainerTitle}>What This Means</h2>
        <p className={styles.explainerText}><strong>Audio fingerprinting</strong> uses the Web Audio API to process a known signal. Browser and operating-system implementation details can affect the result, so it may be combined with other signals.</p>
        <p className={styles.explainerText}>This sample is rendered silently in an <strong>OfflineAudioContext</strong>; it does not play through your speakers. Its non-cryptographic sample ID is useful for repeatability checks, not proof of identity or uniqueness.</p>
      </div>
      <RelatedTools currentSlug="audio-fingerprint" />
    </div></div>
  );
}
