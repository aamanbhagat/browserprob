"use client";
import { useState, useEffect } from "react";
import { detectAudio, type AudioInfo } from "@/lib/detect/audio";
import DataRow from "@/components/DataRow";
import ProbeAnimation from "@/components/ProbeAnimation";
import RelatedTools from "@/components/RelatedTools";
import styles from "../tools.module.css";

export default function AudioFingerprintPage() {
  const [data, setData] = useState<AudioInfo | null>(null);
  useEffect(() => { detectAudio().then(setData); }, []);
  if (!data) return <div className={styles.toolPage}><div className="container"><ProbeAnimation /></div></div>;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://browserprobe.app/tools/audio-fingerprint#webapp",
        "name": "Audio Fingerprint Test",
        "url": "https://browserprobe.app/tools/audio-fingerprint",
        "description": "Generate your audio fingerprint using the AudioContext API.",
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
              "text": "An audio fingerprint is a cryptographic hash of mathematical waveforms processed using a browser's Web Audio API. Due to differences in sound cards, CPU floating-point operations, and OS audio pipelines, the final waveform output has minuscule variations unique to a device."
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      <div className={styles.header}><span className={styles.icon}>🔊</span><h1 className={styles.title}>Audio Fingerprint Test</h1><p className={styles.subtitle}>Generate your unique audio fingerprint using the AudioContext API.</p></div>
      <div className={styles.resultsCard}>
        <div className={styles.resultsHeader}><span className={styles.resultsTitle}>Audio Results</span><span className={styles.statusDot} /></div>
        <DataRow label="AudioContext Supported" value={data.supported} />
        <DataRow label="Fingerprint Hash" value={data.fingerprint} />
        <DataRow label="Sample Rate" value={data.sampleRate > 0 ? `${data.sampleRate} Hz` : "N/A"} />
        <DataRow label="Max Channels" value={data.channelCount > 0 ? data.channelCount : "N/A"} />
      </div>
      <div className={styles.explainer}>
        <h2 className={styles.explainerTitle}>What This Means</h2>
        <p className={styles.explainerText}><strong>Audio fingerprinting</strong> uses the Web Audio API to process a sound signal and generate a unique hash. Different devices process audio slightly differently due to variations in hardware and software, creating a device-specific fingerprint.</p>
        <p className={styles.explainerText}>This technique works silently — no sound is actually played. An inaudible signal is processed through an <strong>OfflineAudioContext</strong>, and the resulting waveform data is hashed into a fingerprint.</p>
      </div>
      <RelatedTools currentSlug="audio-fingerprint" />
    </div></div>
  );
}
