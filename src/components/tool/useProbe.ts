"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Runs a browser probe after the first paint and again on demand. The probe must be a stable,
 * module-level function. Errors become `error` instead of crashing the page.
 */
export function useProbe<T>(probe: () => T | Promise<T>) {
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const frame = requestAnimationFrame(() => {
      Promise.resolve()
        .then(probe)
        .then(
          (result) => {
            if (!cancelled) setValue(result);
          },
          (reason: unknown) => {
            if (!cancelled) setError(reason instanceof Error ? reason.message : "The check could not complete.");
          },
        );
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [probe, runId]);

  const rerun = useCallback(() => {
    setValue(null);
    setError(null);
    setRunId((id) => id + 1);
  }, []);

  return { value, error, ready: value !== null || error !== null, rerun };
}
