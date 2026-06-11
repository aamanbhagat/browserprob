"use client";
import { useState, useEffect } from "react";
import DataRow from "@/components/DataRow";
import ProbeAnimation from "@/components/ProbeAnimation";
import RelatedTools from "@/components/RelatedTools";
import styles from "../tools.module.css";

export default function JavaScriptInfoPage() {
  const [data, setData] = useState<Record<string, string | boolean> | null>(null);
  useEffect(() => {
    const t = setTimeout(() => {
      setData({
        enabled: true,
        es6Modules: typeof Symbol !== "undefined",
        asyncAwait: typeof (async function(){}).constructor === "function",
        webWorkers: typeof Worker !== "undefined",
        serviceWorkers: "serviceWorker" in navigator,
        webAssembly: typeof WebAssembly !== "undefined",
        promises: typeof Promise !== "undefined",
        fetch: typeof fetch !== "undefined",
        intersectionObserver: typeof IntersectionObserver !== "undefined",
        resizeObserver: typeof ResizeObserver !== "undefined",
        mutationObserver: typeof MutationObserver !== "undefined",
        proxy: typeof Proxy !== "undefined",
        weakMap: typeof WeakMap !== "undefined",
        bigInt: typeof BigInt !== "undefined",
        optionalChaining: true,
      });
    }, 600);
    return () => clearTimeout(t);
  }, []);
  if (!data) return <div className={styles.toolPage}><div className="container"><ProbeAnimation /></div></div>;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://browserprobe.app/tools/javascript-info#webapp",
        "name": "JavaScript Detection",
        "url": "https://browserprobe.app/tools/javascript-info",
        "description": "Check if JavaScript is enabled and which features your browser supports.",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Any"
      },
      {
        "@type": "FAQPage",
        "@id": "https://browserprobe.app/tools/javascript-info#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Why do websites require JavaScript to be enabled?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "JavaScript is a client-side programming language that drives page interactivity, handles asynchronous data fetches, controls rich media elements, and powers dynamic user interfaces."
            }
          },
          {
            "@type": "Question",
            "name": "What is WebAssembly (Wasm)?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "WebAssembly (Wasm) is a binary instruction format designed for a stack-based virtual machine in the browser. It enables near-native execution speed for languages like C, C++, and Rust, supporting high-performance games, simulators, and media editors."
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
      <div className={styles.header}>
        <span className={styles.icon}>⚡</span>
        <h1 className={styles.title}>JavaScript Detection</h1>
        <p className={styles.subtitle}>Check which JavaScript features and APIs your browser supports.</p>
      </div>
      <div className={styles.resultsCard}>
        <div className={styles.resultsHeader}><span className={styles.resultsTitle}>JS Features</span><span className={styles.statusDot} /></div>
        <DataRow label="JavaScript Enabled" value={data.enabled} />
        <DataRow label="ES6 Symbols" value={data.es6Modules} />
        <DataRow label="Async/Await" value={data.asyncAwait} />
        <DataRow label="Web Workers" value={data.webWorkers} />
        <DataRow label="Service Workers" value={data.serviceWorkers} />
        <DataRow label="WebAssembly" value={data.webAssembly} />
        <DataRow label="Promises" value={data.promises} />
        <DataRow label="Fetch API" value={data.fetch} />
        <DataRow label="IntersectionObserver" value={data.intersectionObserver} />
        <DataRow label="ResizeObserver" value={data.resizeObserver} />
        <DataRow label="Proxy" value={data.proxy} />
        <DataRow label="BigInt" value={data.bigInt} />
      </div>
      <div className={styles.explainer}>
        <h2 className={styles.explainerTitle}>What This Means</h2>
        <p className={styles.explainerText}><strong>JavaScript</strong> is the programming language that makes websites interactive. Without it, most modern websites would display only static content.</p>
        <p className={styles.explainerText}><strong>Web Workers</strong> allow JavaScript to run in background threads, enabling complex computations without freezing the UI. <strong>Service Workers</strong> enable offline functionality and push notifications.</p>
        <p className={styles.explainerText}><strong>WebAssembly</strong> (Wasm) allows browsers to run near-native-speed code, powering demanding applications like video editors and games directly in the browser.</p>
      </div>
      <RelatedTools currentSlug="javascript-info" />
    </div></div>
  );
}
