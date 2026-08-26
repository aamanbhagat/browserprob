"use client";

import { useState } from "react";
import styles from "./DataRow.module.css";

interface DataRowProps {
  label: string;
  value: string | number | boolean | null | undefined;
  mono?: boolean;
  compact?: boolean;
}

export default function DataRow({ label, value, mono = true, compact = false }: DataRowProps) {
  const [copied, setCopied] = useState(false);

  const displayValue =
    value === null || value === undefined
      ? "Not available"
      : typeof value === "boolean"
      ? value
        ? "Yes ✓"
        : "No ✗"
      : String(value);

  const isUnavailable = value === null || value === undefined;

  const handleCopy = async () => {
    if (isUnavailable) return;
    try {
      await navigator.clipboard.writeText(String(value));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard not available
    }
  };

  return (
    <div className={`${styles.row} ${compact ? styles.compact : ""}`}>
      <span className={styles.label}>{label}</span>
      <div className={styles.valueWrap}>
        <span
          className={`${styles.value} ${mono ? styles.mono : ""} ${
            isUnavailable ? styles.unavailable : ""
          }`}
        >
          {displayValue}
        </span>
        {!isUnavailable && (
          <button
            className={styles.copyBtn}
            onClick={handleCopy}
            aria-label={`Copy ${label}`}
            title="Copy to clipboard"
          >
            {copied ? "✓" : "⧉"}
          </button>
        )}
      </div>
    </div>
  );
}
