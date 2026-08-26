"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#eef3f8", color: "#10233d", fontFamily: "system-ui, sans-serif" }}>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
          <section style={{ width: "min(560px, 100%)", boxSizing: "border-box", padding: 40, background: "white", border: "1px solid #c4d0de", borderTop: "5px solid #2458e8", borderRadius: 10 }}>
            <p style={{ color: "#2458e8", fontFamily: "monospace", fontWeight: 700, textTransform: "uppercase" }}>BrowserProbe interrupted</p>
            <h1 style={{ margin: "10px 0", fontSize: 42, letterSpacing: "-0.04em" }}>The page could not render.</h1>
            <p style={{ color: "#465a70", lineHeight: 1.6 }}>Retry the request. No browser report was saved by BrowserProbe.</p>
            <button type="button" onClick={reset} style={{ marginTop: 18, padding: "11px 18px", color: "white", background: "#2458e8", border: 0, borderRadius: 5, fontWeight: 700, cursor: "pointer" }}>Try again</button>
          </section>
        </main>
      </body>
    </html>
  );
}
