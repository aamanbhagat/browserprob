import Link from "next/link";
import { tools, categories } from "@/lib/tools";
import { blogPosts } from "@/data/blog-posts";
import ToolCard from "@/components/ToolCard";
import HomeDashboard from "@/components/HomeDashboard";
import styles from "./page.module.css";

const faqItems = [
  {
    q: "What does BrowserProbe test?",
    a: "BrowserProbe checks browser-reported identity, public IP, WebRTC candidates, screen and viewport data, storage access, privacy preference signals, graphics capabilities, selected fingerprint surfaces, and support for modern web APIs.",
  },
  {
    q: "Does BrowserProbe store my scan results?",
    a: "BrowserProbe does not create an account or save the assembled report in an application database. Most checks run in the current tab; the IP check, public STUN service, and disclosed third-party monetization code create the network exceptions described in the privacy policy.",
  },
  {
    q: "Is a browser fingerprint proof that I am unique?",
    a: "No. A fingerprint sample shows that a surface is available and reproducible in this session. Proving uniqueness requires comparing it with a representative population over time, which this site does not claim to do.",
  },
  {
    q: "Does a public WebRTC address always mean my VPN is leaking?",
    a: "No. A public ICE candidate alone is not proof of a VPN leak. Compare it with the public IP reported by the IP check and with the address your VPN provider expects. BrowserProbe labels the evidence and confidence instead of making an automatic leak claim.",
  },
  {
    q: "Why can some results say limited or unavailable?",
    a: "Browsers intentionally reduce, freeze, or permission-gate sensitive values. Extensions, enterprise policies, private modes, and browser privacy protections can also change what a page can observe.",
  },
];

export default function HomePage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }}
      />

      <section className={styles.hero}>
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>Instant browser inspection</span>
            <h1>Your browser, explained.</h1>
            <p>
              Generate a clear diagnostic report for the browser you are using now—what it reports, which privacy signals are active, and where a result needs context.
            </p>
            <a className="btn btn-primary" href="#report">View my report</a>
          </div>

          <aside className={styles.heroMethod} aria-label="How the report is evaluated">
            <div className={styles.methodTop}>
              <span>Inspection method</span>
              <strong>Evidence first</strong>
            </div>
            <dl>
              <div><dt>Detected</dt><dd>Directly reported by a browser API</dd></div>
              <div><dt>Inferred</dt><dd>Interpretation with a confidence label</dd></div>
              <div><dt>Limited</dt><dd>Hidden, permission-gated, or unsupported</dd></div>
            </dl>
            <p>Results describe this session. They do not verify a physical device or guarantee anonymity.</p>
          </aside>
        </div>
      </section>

      <section className={styles.reportSection} id="report" aria-label="Live browser diagnostic report">
        <div className="container">
          <HomeDashboard />
        </div>
      </section>

      <section className={styles.assuranceStrip} aria-label="BrowserProbe principles">
        <div className={`container ${styles.assuranceGrid}`}>
          <div><strong>Observed, not guessed</strong><span>Raw values and interpretation stay separate.</span></div>
          <div><strong>Confidence included</strong><span>Limited browser signals are labeled honestly.</span></div>
          <div><strong>No app report database</strong><span>BrowserProbe does not persist the assembled scan.</span></div>
        </div>
      </section>

      <section id="tools" className={styles.toolsSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div><span>Deep-dive checks</span><h2>Inspect one signal at a time</h2></div>
            <p>Open a focused test for a larger result, methodology notes, limitations, and practical next steps.</p>
          </div>

          {Object.entries(categories).map(([key, category]) => {
            const categoryTools = tools.filter((tool) => tool.category === key);
            if (categoryTools.length === 0) return null;
            return (
              <div key={key} className={styles.categorySection}>
                <h3 style={{ color: category.color }}>{category.name}</h3>
                <div className="tool-grid">
                  {categoryTools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className={styles.howSection}>
        <div className={`container ${styles.howGrid}`}>
          <div>
            <span className={styles.eyebrow}>How to read the report</span>
            <h2>Facts, findings, and limits</h2>
            <p>A useful diagnostic tool must say what it knows, how it knows it, and what it cannot prove.</p>
          </div>
          <ol>
            <li><span>01</span><div><strong>Read the reported value</strong><p>Start with the browser or network signal itself.</p></div></li>
            <li><span>02</span><div><strong>Check the evidence label</strong><p>Source and confidence explain how reliable the interpretation is.</p></div></li>
            <li><span>03</span><div><strong>Open the focused test</strong><p>Review limitations and remediation before changing settings.</p></div></li>
          </ol>
        </div>
      </section>

      <section className={styles.guidesSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div><span>Browser privacy guides</span><h2>Understand what the signals mean</h2></div>
            <Link href="/blog">View all guides →</Link>
          </div>
          <div className={styles.guideGrid}>
            {blogPosts.slice(0, 3).map((post) => (
              <article key={post.slug}>
                <span>{post.category} · {post.readTime}</span>
                <h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>
                <p>{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`}>Read guide →</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.faqSection}>
        <div className="container">
          <div className={styles.faqGrid}>
            <div><span className={styles.eyebrow}>Questions</span><h2>What this report can—and cannot—tell you</h2></div>
            <div className={styles.faqList}>
              {faqItems.map((item) => (
                <details key={item.q} className={styles.faqItem}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
