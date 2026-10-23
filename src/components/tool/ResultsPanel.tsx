"use client";

import type { ReactNode } from "react";
import styles from "./ResultsPanel.module.css";
import extra from "./results.module.css";

interface ResultsPanelProps {
  title?: string;
  ready: boolean;
  /** Shown while the check runs; keep it specific to what is happening. */
  pendingLabel?: string;
  /** Number of placeholder rows to reserve while loading, to keep the layout from jumping. */
  rows?: number;
  onRerun?: () => void;
  rerunLabel?: string;
  children: ReactNode;
}

export default function ResultsPanel({
  title = "Your results",
  ready,
  pendingLabel = "Reading values from your browser…",
  rows = 6,
  onRerun,
  rerunLabel = "Run again",
  children,
}: ResultsPanelProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {onRerun && (
          <button type="button" className={styles.rerun} onClick={onRerun} disabled={!ready}>
            {rerunLabel}
          </button>
        )}
      </div>
      <div className={styles.body} aria-live="polite" aria-busy={!ready}>
        {ready ? (
          children
        ) : (
          <div className={styles.pending}>
            <p className={styles.pendingLabel}>{pendingLabel}</p>
            {Array.from({ length: rows }, (_, index) => (
              <div key={index} className={styles.skeletonRow} aria-hidden="true">
                <span />
                <span />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function PanelNote({ children }: { children: ReactNode }) {
  return <p className={styles.note}>{children}</p>;
}

export function PanelGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className={styles.group}>
      <h3 className={styles.groupTitle}>{title}</h3>
      {children}
    </div>
  );
}

export function Verdict({ level = "ok", title, children }: { level?: "ok" | "info" | "review"; title: string; children: ReactNode }) {
  return (
    <div className={`${extra.verdict} ${level === "ok" ? "" : extra[level]}`}>
      <p className={extra.verdictTitle}>{title}</p>
      <p className={extra.verdictText}>{children}</p>
    </div>
  );
}
