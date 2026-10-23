"use client";

import { useState } from "react";
import styles from "./CodeBlock.module.css";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setState("copied");
    } catch {
      setState("failed");
    }
    setTimeout(() => setState("idle"), 2000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.language}>{language || "code"}</span>
        <button type="button" onClick={handleCopy} className={styles.copyBtn} aria-live="polite">
          {state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : "Copy"}
        </button>
      </div>
      {/* Focusable so keyboard users can scroll long lines. */}
      <pre className={styles.pre} tabIndex={0} aria-label={`${language || "Code"} example`}>
        <code className={styles.code}>{code}</code>
      </pre>
    </div>
  );
}
