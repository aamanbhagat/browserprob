"use client";

import { useEffect, useRef } from "react";
import { ADS_ENABLED, ADSENSE_CLIENT } from "@/lib/ads";
import styles from "./AdSlot.module.css";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

// Height reserved for every unit, so the page never shifts when an ad loads (or stays empty).
// Google asks for unit sizes to be set inline rather than in external stylesheets.
const AD_HEIGHT = 250;

// React may mount a component twice in development; AdSense errors if the same <ins> is pushed twice.
const pushed = new WeakSet<Element>();

function AdUnit({ slot }: { slot: string }) {
  const ref = useRef<HTMLModElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || pushed.has(element) || element.getAttribute("data-adsbygoogle-status")) return;
    pushed.add(element);
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // The loader is missing or blocked (for example by a content blocker); the reserved space stays empty.
    }
  }, []);

  return (
    <aside className={styles.slot} aria-label="Advertisement">
      <p className={styles.label}>Advertisement</p>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: "block", width: "100%", height: AD_HEIGHT }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
      />
    </aside>
  );
}

/**
 * A labelled, fixed-height display ad. Renders nothing unless ads are enabled for this build and the
 * slot has an ID from the AdSense dashboard.
 */
export default function AdSlot({ slot }: { slot: string | null }) {
  if (!ADS_ENABLED || !slot) return null;
  return <AdUnit slot={slot} />;
}
