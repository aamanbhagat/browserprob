import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="status-page">
      <div className="status-card">
        <span className="status-code">HTTP 404 · No result</span>
        <h1>This route left no trace.</h1>
        <p>The page may have moved, or the address may be incomplete. Start a fresh browser report or browse the focused diagnostic tools.</p>
        <div className="status-actions">
          <Link className="status-primary" href="/#report">Run browser check</Link>
          <Link className="status-secondary" href="/tools">Browse all tests</Link>
        </div>
      </div>
    </section>
  );
}
