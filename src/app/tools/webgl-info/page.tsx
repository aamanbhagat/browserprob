"use client";
import { useState, useEffect } from "react";
import { detectWebGL, type WebGLInfo } from "@/lib/detect/webgl";
import DataRow from "@/components/DataRow";
import ToolLoading from "@/components/ToolLoading";
import RelatedTools from "@/components/RelatedTools";
import styles from "../tools.module.css";

export default function WebGLInfoPage() {
  const [data, setData] = useState<WebGLInfo | null>(null);
  useEffect(() => { const frame = requestAnimationFrame(() => setData(detectWebGL())); return () => cancelAnimationFrame(frame); }, []);
  if (!data) return <ToolLoading title="WebGL Information" />;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://browserprobe.app/tools/webgl-info#webapp",
        "name": "WebGL Information",
        "url": "https://browserprobe.app/tools/webgl-info",
        "description": "View WebGL capabilities, GPU renderer, vendor, and extensions.",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Any"
      },
      {
        "@type": "FAQPage",
        "@id": "https://browserprobe.app/tools/webgl-info#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is WebGL in a web browser?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "WebGL (Web Graphics Library) is a JavaScript API for rendering high-performance interactive 3D and 2D graphics within any compatible web browser without the use of plug-ins."
            }
          },
          {
            "@type": "Question",
            "name": "How does WebGL contribute to device tracking?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "WebGL can expose a renderer string, vendor string, limits, and supported extensions. Those details may contribute to a broader browser fingerprint, but they do not prove identity or uniqueness on their own."
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
      <div className={styles.header}><span className={styles.icon}>🎮</span><h1 className={styles.title}>WebGL Information</h1><p className={styles.subtitle}>View your WebGL capabilities, GPU renderer, vendor, and extensions.</p></div>
      <div className={styles.resultsCard}>
        <div className={styles.resultsHeader}><span className={styles.resultsTitle}>WebGL Details</span><span className={styles.statusDot} /></div>
        <DataRow label="WebGL Supported" value={data.supported} />
        <DataRow label="WebGL 2.0" value={data.webgl2} />
        <DataRow label="Version" value={data.version} />
        <DataRow label="GPU Renderer" value={data.renderer} />
        <DataRow label="GPU Vendor" value={data.vendor} />
        <DataRow label="Shading Language" value={data.shadingLanguageVersion} />
        <DataRow label="Max Texture Size" value={`${data.maxTextureSize}px`} />
        <DataRow label="Max Viewport" value={data.maxViewportDims} />
        <DataRow label="Extensions" value={`${data.extensions.length} available`} />
      </div>
      {data.extensions.length > 0 && (
        <details className={styles.resultsCard} style={{ cursor: "pointer" }}>
          <summary style={{ padding: "12px 16px", color: "var(--text-secondary)", fontSize: "0.85rem" }}>View all {data.extensions.length} extensions</summary>
          <div style={{ padding: "0 16px 16px", fontSize: "0.8rem", fontFamily: "var(--font-mono), monospace", color: "var(--text-muted)", lineHeight: 1.8 }}>
            {data.extensions.join(", ")}
          </div>
        </details>
      )}
      <div className={styles.explainer}>
        <h2 className={styles.explainerTitle}>What This Means</h2>
        <p className={styles.explainerText}><strong>WebGL</strong> (Web Graphics Library) enables hardware-accelerated 3D graphics directly in your browser. It powers browser games, data visualizations, and interactive 3D experiences.</p>
        <p className={styles.explainerText}>The <strong>GPU renderer</strong> and <strong>vendor</strong> strings may be exact, generalized, or software-rendered depending on browser and privacy protections. Together with limits and extensions, they can contribute to fingerprinting.</p>
        <p className={styles.explainerText}><strong>WebGL 2.0</strong> offers significant improvements over 1.0, including 3D textures, occlusion queries, and transform feedback — features essential for advanced graphics applications.</p>
      </div>
      <RelatedTools currentSlug="webgl-info" />
    </div></div>
  );
}
