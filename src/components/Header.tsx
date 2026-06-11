"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={`${styles.header} glass`}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo} aria-label="BrowserProbe Home">
          <span className={styles.logoIcon}>◎</span>
          <span className={styles.logoText}>
            Browser<span className="gradient-text">Probe</span>
          </span>
        </Link>

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
          <Link href="/" className={styles.navLink} onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link href="/tools/what-is-my-browser" className={styles.navLink} onClick={() => setMenuOpen(false)}>
            Tools
          </Link>
          <Link href="/blog" className={styles.navLink} onClick={() => setMenuOpen(false)}>
            Blog
          </Link>
          <Link href="/about" className={styles.navLink} onClick={() => setMenuOpen(false)}>
            About
          </Link>
        </nav>

        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className={`${styles.hamburgerLine} ${menuOpen ? styles.line1Open : ""}`} />
          <span className={`${styles.hamburgerLine} ${menuOpen ? styles.line2Open : ""}`} />
          <span className={`${styles.hamburgerLine} ${menuOpen ? styles.line3Open : ""}`} />
        </button>
      </div>
    </header>
  );
}
