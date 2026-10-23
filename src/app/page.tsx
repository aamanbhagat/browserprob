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
