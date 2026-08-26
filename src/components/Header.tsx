"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo} aria-label="BrowserProbe home" onClick={closeMenu}>
          <span className={styles.logoMark} aria-hidden="true"><i /><i /><i /></span>
          <span>BrowserProbe</span>
        </Link>

        <nav id="primary-navigation" className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`} aria-label="Primary navigation">
          <Link href="/#report" className={styles.navLink} onClick={closeMenu}>Scan</Link>
          <Link href="/#tools" className={styles.navLink} onClick={closeMenu}>Tests</Link>
          <Link href="/blog" className={styles.navLink} onClick={closeMenu}>Guides</Link>
          <Link href="/about" className={styles.navLink} onClick={closeMenu}>Method</Link>
          <a href="https://github.com/aamanbhagat/browserprob" className={styles.sourceLink} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>Source</a>
          <Link href="/#report" className={styles.scanButton} onClick={closeMenu}>Run scan</Link>
        </nav>

        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
        >
          <span /><span /><span />
        </button>
      </div>
      {menuOpen && <button className={styles.backdrop} type="button" onClick={closeMenu} aria-label="Close navigation" />}
    </header>
  );
}
