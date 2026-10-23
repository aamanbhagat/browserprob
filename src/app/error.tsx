"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="status-page">
      <div className="status-card">
        <span className="status-code">Diagnostic interrupted</span>
        <h1>The report could not finish.</h1>
        <p>Your browser may have blocked a required API or the page hit an unexpected error. Retry the local checks; no report was saved.</p>
        <div className="status-actions">
          <button className="status-primary" type="button" onClick={reset}>Try again</button>
          <Link className="status-secondary" href="/">Return home</Link>
        </div>
      </div>
    </section>
  );
}
