import Link from "next/link";
import { tools } from "@/lib/tools";
import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoIcon}>BP</span>
              <span>BrowserProbe</span>
            </Link>
            <p className={styles.tagline}>
              Evidence-based browser diagnostics that distinguish observed values, interpretations, and limitations.
            </p>
          </div>

          <div className={styles.linkGroup}>
            <h2 className={styles.groupTitle}>Popular Tools</h2>
            <ul className={styles.linkList}>
              {tools.slice(0, 6).map((tool) => (
                <li key={tool.slug}>
                  <Link href={`/tools/${tool.slug}`} className={styles.link}>
                    {tool.shortName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.linkGroup}>
            <h2 className={styles.groupTitle}>More Tools</h2>
            <ul className={styles.linkList}>
              {tools.slice(6, 12).map((tool) => (
                <li key={tool.slug}>
                  <Link href={`/tools/${tool.slug}`} className={styles.link}>
                    {tool.shortName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.linkGroup}>
            <h2 className={styles.groupTitle}>Resources</h2>
            <ul className={styles.linkList}>
              <li>
                <Link href="/blog" className={styles.link}>Blog</Link>
              </li>
              <li>
                <Link href="/about" className={styles.link}>About</Link>
              </li>
              <li>
                <Link href="/privacy-policy" className={styles.link}>Privacy Policy</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {year} BrowserProbe.app — All rights reserved.
          </p>
          <p className={styles.powered}>
            Open-source methodology · No app report database
          </p>
        </div>
      </div>
    </footer>
  );
}
