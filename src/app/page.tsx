import Link from "next/link";
import { tools, categories } from "@/lib/tools";
import ToolCard from "@/components/ToolCard";
import HomeDashboard from "@/components/HomeDashboard";
import styles from "./page.module.css";

export default function HomePage() {
  const faqItems = [
    {
      q: "What is BrowserProbe?",
      a: "BrowserProbe is a free suite of online tools that reveals what information your browser exposes to websites. It includes tools for browser detection, privacy leak testing, fingerprint analysis, and hardware diagnostics — all running directly on this page.",
    },
    {
      q: "Is BrowserProbe safe to use?",
      a: "Yes. BrowserProbe runs entirely in your browser — no data is sent to our servers. All detection is performed client-side using standard browser APIs. We do not store or share any results.",
    },
    {
      q: "What is browser fingerprinting?",
      a: "Browser fingerprinting is a technique websites use to identify visitors by collecting unique characteristics of their browser, device, and settings. This can include your screen resolution, installed fonts, GPU renderer, and more. BrowserProbe helps you see exactly what data contributes to your digital fingerprint.",
    },
    {
      q: "Can websites really track me without cookies?",
      a: "Yes. While cookies are the most well-known tracking method, browser fingerprinting can identify you without storing anything on your device. Techniques like canvas fingerprinting, WebGL fingerprinting, and audio fingerprinting can create unique identifiers that persist even in private/incognito browsing.",
    },
    {
      q: "How can I protect my privacy online?",
      a: "Use a privacy-focused browser like Firefox or Brave, enable Do Not Track and Global Privacy Control, use a VPN to hide your IP address, and regularly check for WebRTC leaks. Our tools help you verify that your privacy settings are working correctly.",
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <span className="badge">Free &amp; Instant</span>
            <h1 className={styles.heroTitle}>
              Probe Your <span className="gradient-text">Browser</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Everything websites can see about you — your browser, IP, screen,
              GPU, fingerprints, privacy leaks, and 30+ API checks — all
              scanned instantly below.
            </p>
          </div>
          <div className={styles.heroGlow} aria-hidden="true" />
        </div>
      </section>

      {/* Live Dashboard — ALL results shown here */}
      <section className="section-sm">
        <div className="container">
          <HomeDashboard />
        </div>
      </section>

      {/* Individual Tools for deep-dive */}
      <section id="tools" className="section-sm">
        <div className="container">
          <h2 className={styles.sectionTitle}>Deep-Dive Tools</h2>
          <p className={styles.sectionSubtitle}>
            Click any tool below for detailed results, explanations, and
            privacy tips.
          </p>

          {Object.entries(categories).map(([key, cat]) => {
            const catTools = tools.filter((t) => t.category === key);
            if (catTools.length === 0) return null;
            return (
              <div key={key} className={styles.categorySection}>
                <h3
                  className={styles.categoryTitle}
                  style={{ color: cat.color }}
                >
                  {cat.name}
                </h3>
                <div className="tool-grid stagger">
                  {catTools.map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Blog preview */}
      <section className="section-sm">
        <div className="container">
          <h2 className={styles.sectionTitle}>Learn More</h2>
          <p className={styles.sectionSubtitle}>
            Deep dives into browser privacy, fingerprinting, and online
            security.
          </p>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "var(--space-lg)" }}>
            <Link href="/blog" className="btn btn-secondary">
              Read the Blog →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-sm">
        <div className="container">
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            {faqItems.map((item, i) => (
              <details key={i} className={styles.faqItem}>
                <summary className={styles.faqQuestion}>{item.q}</summary>
                <p className={styles.faqAnswer}>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
