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
              <span className={styles.logoIcon}>◎</span>
              <span>
                Browser<span className="gradient-text">Probe</span>
              </span>
            </Link>
            <p className={styles.tagline}>
              Free browser diagnostics and privacy tools. Discover what websites
              can see about you.
            </p>
          </div>

          <div className={styles.linkGroup}>
            <h3 className={styles.groupTitle}>Popular Tools</h3>
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
            <h3 className={styles.groupTitle}>More Tools</h3>
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
            <h3 className={styles.groupTitle}>Resources</h3>
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
            Built with Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}
