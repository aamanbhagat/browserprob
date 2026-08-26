"use client";
import { useState, useEffect } from "react";
import ToolLoading from "@/components/ToolLoading";
import RelatedTools from "@/components/RelatedTools";
import styles from "../tools.module.css";

interface Feature { name: string; supported: boolean; }

export default function BrowserFeaturesPage() {
  const [features, setFeatures] = useState<Feature[] | null>(null);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const f: Feature[] = [
        { name: "WebSocket", supported: typeof WebSocket !== "undefined" },
        { name: "Fetch API", supported: typeof fetch !== "undefined" },
        { name: "Service Worker", supported: "serviceWorker" in navigator },
        { name: "Web Workers", supported: typeof Worker !== "undefined" },
        { name: "SharedArrayBuffer", supported: typeof SharedArrayBuffer !== "undefined" },
        { name: "WebAssembly", supported: typeof WebAssembly !== "undefined" },
        { name: "IndexedDB", supported: typeof indexedDB !== "undefined" },
        { name: "Web Crypto API", supported: typeof crypto?.subtle !== "undefined" },
        { name: "Geolocation", supported: "geolocation" in navigator },
        { name: "Notifications", supported: "Notification" in window },
        { name: "Push API", supported: "PushManager" in window },
        { name: "Clipboard API", supported: "clipboard" in navigator },
        { name: "Fullscreen API", supported: "fullscreenEnabled" in document },
        { name: "Gamepad API", supported: "getGamepads" in navigator },
        { name: "Vibration API", supported: "vibrate" in navigator },
        { name: "Battery API", supported: "getBattery" in navigator },
        { name: "Bluetooth API", supported: "bluetooth" in navigator },
        { name: "USB API", supported: "usb" in navigator },
        { name: "Web Share API", supported: "share" in navigator },
        { name: "Payment Request", supported: "PaymentRequest" in window },
        { name: "Credential Management", supported: "credentials" in navigator },
        { name: "Intersection Observer", supported: typeof IntersectionObserver !== "undefined" },
        { name: "Resize Observer", supported: typeof ResizeObserver !== "undefined" },
        { name: "Performance Observer", supported: typeof PerformanceObserver !== "undefined" },
        { name: "CSS Houdini (Paint)", supported: typeof CSS !== "undefined" && "paintWorklet" in CSS },
        { name: "Web Animations API", supported: typeof Element.prototype.animate !== "undefined" },
        { name: "Screen Wake Lock", supported: "wakeLock" in navigator },
        { name: "File System Access", supported: "showOpenFilePicker" in window },
        { name: "WebRTC", supported: typeof RTCPeerConnection !== "undefined" },
        { name: "Canvas 2D", supported: !!document.createElement("canvas").getContext("2d") },
        { name: "WebGL", supported: !!document.createElement("canvas").getContext("webgl") },
        { name: "WebGL 2.0", supported: !!document.createElement("canvas").getContext("webgl2") },
      ];
      setFeatures(f);
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  if (!features) return <ToolLoading title="Browser Features Support" />;
  const supported = features.filter(f => f.supported).length;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://browserprobe.app/tools/browser-features#webapp",
        "name": "Browser Features Support",
        "url": "https://browserprobe.app/tools/browser-features",
        "description": "Test your browser's support for 30+ modern web APIs and browser features.",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Any"
      },
      {
        "@type": "FAQPage",
        "@id": "https://browserprobe.app/tools/browser-features#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is browser feature detection?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Browser feature detection is a practice of checking if a specific API, property, or method is supported by the user's browser before executing code. This is a robust alternative to user-agent sniffing."
            }
          },
          {
            "@type": "Question",
            "name": "Why do different browsers support different web APIs?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Browser vendors prioritize APIs based on standards consensus, security boundaries, user utility, and privacy impacts. For example, Safari disables many sensors and hardware APIs by default to resist fingerprint tracking."
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
      <div className={styles.header}><span className={styles.icon}>✅</span><h1 className={styles.title}>Browser Features Support</h1><p className={styles.subtitle}>Test your browser&apos;s support for {features.length} modern web APIs and features.</p></div>
      <div className={styles.resultsCard} style={{ marginBottom: "var(--space-lg)" }}>
        <div className={styles.resultsHeader}><span className={styles.resultsTitle}>Summary</span><span className={styles.statusDot} /></div>
        <div style={{ padding: "16px", textAlign: "center" }}>
          <span style={{ fontSize: "2.5rem", fontWeight: 700 }} className="gradient-text">{supported}</span>
          <span style={{ color: "var(--text-muted)", fontSize: "1.2rem" }}> / {features.length}</span>
          <p style={{ color: "var(--text-secondary)", marginTop: 4, fontSize: "0.85rem" }}>APIs supported by your browser</p>
        </div>
      </div>
      <div className={styles.featureGrid}>
        {features.map((f) => (
          <div key={f.name} className={styles.featureItem}>
            <span className={styles.featureName}>{f.name}</span>
            <span className={f.supported ? styles.featureYes : styles.featureNo}>{f.supported ? "✓ Yes" : "✗ No"}</span>
          </div>
        ))}
      </div>
      <div className={styles.explainer}>
        <h2 className={styles.explainerTitle}>What This Means</h2>
        <p className={styles.explainerText}>This test checks your browser&apos;s support for <strong>modern web APIs</strong>. More supported APIs generally means a more capable browser, but it also increases your fingerprint surface area.</p>
        <p className={styles.explainerText}>APIs marked with ✗ may not be supported by your specific browser, or may require user permission or a secure context (HTTPS) to function.</p>
      </div>
      <RelatedTools currentSlug="browser-features" />
    </div></div>
  );
}
