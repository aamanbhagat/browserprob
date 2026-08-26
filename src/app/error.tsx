"use client";

import { useEffect } from "react";
import Link from "next/link";
import styles from "./status.module.css";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className={styles.page}>
      <div className={styles.card}>
        <span className={styles.code}>Diagnostic interrupted</span>
        <h1>The report could not finish.</h1>
        <p>Your browser may have blocked a required API or the page hit an unexpected error. Retry the local checks; no report was saved.</p>
        <div className={styles.actions}>
          <button className={styles.primary} type="button" onClick={reset}>Try again</button>
          <Link className={styles.secondary} href="/">Return home</Link>
        </div>
      </div>
    </section>
  );
}
