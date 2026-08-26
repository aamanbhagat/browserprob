import Link from "next/link";
import type { Metadata } from "next";
import styles from "./status.module.css";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className={styles.page}>
      <div className={styles.card}>
        <span className={styles.code}>HTTP 404 · No result</span>
        <h1>This route left no trace.</h1>
        <p>The page may have moved, or the address may be incomplete. Start a fresh browser report or browse the focused diagnostic tools.</p>
        <div className={styles.actions}>
          <Link className={styles.primary} href="/">Run browser scan</Link>
          <Link className={styles.secondary} href="/#tools">Browse tools</Link>
        </div>
      </div>
    </section>
  );
}
