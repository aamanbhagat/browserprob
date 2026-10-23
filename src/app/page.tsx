import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import ToolCard from "@/components/ToolCard";
import ScanReport from "@/components/home/ScanReport";
import { blogPosts } from "@/data/blog-posts";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import { categories, tools, type ToolCategory } from "@/lib/tools";
import styles from "./page.module.css";

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl("/") },
};

const categoryOrder: ToolCategory[] = ["identity", "privacy", "hardware", "features"];

export default function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl("/"),
    description: "Browser diagnostics that show what websites can read about your browser, device and network, with the limits of each result explained.",
  };

  return (
    <div className={styles.home}>
      <JsonLd data={structuredData} />
      <section className={`container ${styles.hero}`} aria-labelledby="home-title">
        <p className={styles.eyebrow}>Free browser diagnostics</p>
        <h1 id="home-title" className={styles.title}>See what your browser tells every website.</h1>
        <p className={styles.intro}>
          BrowserProbe reads the same values any page can read: your browser and version, IP address, WebRTC addresses, screen,
          time zone, storage, and the canvas, audio and font signals used for fingerprinting. Each result says where it came from
          and what it cannot prove.
        </p>
        <div id="report" className={styles.scan}>
          <ScanReport />
        </div>
      </section>

      <section id="tools" className={`container ${styles.section}`} aria-labelledby="tools-title">
        <h2 id="tools-title" className={styles.sectionTitle}>Individual tests</h2>
        <p className={styles.sectionIntro}>Each test has its own page with the full result and an explanation of how to read it.</p>
        {categoryOrder.map((category) => (
          <div key={category} className={styles.category}>
            <h3 className={styles.categoryTitle}>{categories[category].name}</h3>
            <div className="tool-grid">
              {tools.filter((tool) => tool.category === category).map((tool) => <ToolCard key={tool.slug} tool={tool} headingLevel="h4" />)}
            </div>
          </div>
        ))}
      </section>

      <section className={`container ${styles.section}`} aria-labelledby="how-title">
        <h2 id="how-title" className={styles.sectionTitle}>How the check works</h2>
        <div className={styles.columns}>
          <div>
            <h3 className={styles.columnTitle}>It reads what any page can read</h3>
            <p>
              The check calls the same browser APIs ordinary websites use: the user-agent string and Client Hints, screen and
              window sizes, the Intl time zone, storage, Canvas, Web Audio, WebGL and font measurements. Nothing is installed and no
              permission prompt appears.
            </p>
          </div>
          <div>
            <h3 className={styles.columnTitle}>Two parts use the network</h3>
            <p>
              Your IP address comes from one request to this site&apos;s own server, which sees where the request came from. The
              WebRTC part asks Cloudflare&apos;s public STUN server which address it sees, because that is how WebRTC discovers
              addresses. Everything else stays in the tab.
            </p>
          </div>
          <div>
            <h3 className={styles.columnTitle}>No score, just evidence</h3>
            <p>
              The report lists what was found and links to a page that explains each item, including what it cannot prove. It does
              not rate how unique you are: that would need data about millions of browsers, which one visit to one site cannot
              provide.
            </p>
          </div>
        </div>
      </section>

      <section className={`container ${styles.section}`} aria-labelledby="home-faq-title">
        <h2 id="home-faq-title" className={styles.sectionTitle}>Questions people ask first</h2>
        <div className={styles.faq}>
          <h3>Is anything saved when I run the check?</h3>
          <p>
            No. The results are built in your browser and disappear when you leave the page, unless you copy or download them
            yourself. The <Link href="/privacy-policy">privacy policy</Link> lists the few places where data leaves your device.
          </p>
          <h3>Why do some rows say &quot;Not supported in this browser&quot;?</h3>
          <p>
            Browsers implement different APIs. Firefox and Safari, for example, have no Battery Status or Network Information API.
            A missing value means your browser does not expose it, which is often a deliberate privacy choice.
          </p>
          <h3>Can this tell me whether my VPN works?</h3>
          <p>
            Partly. The <Link href="/tools/what-is-my-ip">IP address test</Link> shows the address websites see, and the{" "}
            <Link href="/tools/webrtc-leak-test">WebRTC leak test</Link> checks whether WebRTC reveals a different one. Compare both
            with the exit address your VPN provider shows.
          </p>
        </div>
      </section>

      <section className={`container ${styles.section}`} aria-labelledby="guides-title">
        <h2 id="guides-title" className={styles.sectionTitle}>Guides</h2>
        <ul className={styles.guides}>
          {blogPosts.slice(0, 6).map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              <p>{post.excerpt}</p>
            </li>
          ))}
        </ul>
        <Link className={styles.allLink} href="/blog">All guides</Link>
      </section>
    </div>
  );
}
