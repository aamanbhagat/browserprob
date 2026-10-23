import Link from "next/link";
import { SOURCE_URL } from "@/lib/site";
import { tools } from "@/lib/tools";
import styles from "./Footer.module.css";

const POPULAR = ["what-is-my-ip", "what-is-my-browser", "webrtc-leak-test", "screen-resolution", "cookies-test", "canvas-fingerprint"];

export default function Footer() {
  const popular = POPULAR.map((slug) => tools.find((tool) => tool.slug === slug)!).filter(Boolean);

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoIcon} aria-hidden="true">BP</span>
              <span>BrowserProbe</span>
            </Link>
            <p className={styles.tagline}>
              Browser tests that show what websites can read, and explain what each result can and cannot prove.
            </p>
          </div>

          <nav className={styles.linkGroup} aria-labelledby="footer-tests">
            <h2 id="footer-tests" className={styles.groupTitle}>Popular tests</h2>
            <ul className={styles.linkList}>
              {popular.map((tool) => (
                <li key={tool.slug}><Link href={`/tools/${tool.slug}`} className={styles.link}>{tool.name}</Link></li>
              ))}
              <li><Link href="/tools" className={styles.link}>All {tools.length} tests</Link></li>
            </ul>
          </nav>

          <nav className={styles.linkGroup} aria-labelledby="footer-site">
            <h2 id="footer-site" className={styles.groupTitle}>BrowserProbe</h2>
            <ul className={styles.linkList}>
              <li><Link href="/blog" className={styles.link}>Guides</Link></li>
              <li><Link href="/about" className={styles.link}>About and method</Link></li>
              <li><Link href="/contact" className={styles.link}>Contact</Link></li>
              <li><a href={SOURCE_URL} className={styles.link} rel="noopener noreferrer">Source code</a></li>
            </ul>
          </nav>

          <nav className={styles.linkGroup} aria-labelledby="footer-legal">
            <h2 id="footer-legal" className={styles.groupTitle}>Legal</h2>
            <ul className={styles.linkList}>
              <li><Link href="/privacy-policy" className={styles.link}>Privacy policy</Link></li>
              <li><Link href="/terms" className={styles.link}>Terms of use</Link></li>
              <li><Link href="/advertising-and-cookies" className={styles.link}>Advertising and cookies</Link></li>
            </ul>
          </nav>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>© {new Date().getFullYear()} BrowserProbe</p>
          <p className={styles.powered}>Results are computed in your browser and are not stored.</p>
        </div>
      </div>
    </footer>
  );
}
