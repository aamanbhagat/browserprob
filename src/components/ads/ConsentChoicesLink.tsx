"use client";

import { useEffect, useState } from "react";
import { ADS_ENABLED } from "@/lib/ads";

interface GoogleFc {
  callbackQueue?: Array<Record<string, () => void>>;
  showRevocationMessage?: () => void;
}

declare global {
  interface Window {
    googlefc?: GoogleFc;
  }
}

/**
 * Integration point for Google's certified consent management platform (Privacy & messaging in
 * AdSense). The CMP itself is delivered by the AdSense tag; this only adds the footer link that lets
 * visitors reopen it, using the documented googlefc.showRevocationMessage() API. The link stays hidden
 * until Google reports that its consent API is ready, so it never appears as a dead control.
 * https://developers.google.com/funding-choices/fc-api-docs
 */
export default function ConsentChoicesLink({ className }: { className?: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ADS_ENABLED) return;
    window.googlefc = window.googlefc || {};
    window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];
    window.googlefc.callbackQueue.push({ CONSENT_API_READY: () => setReady(true) });
  }, []);

  if (!ADS_ENABLED || !ready) return null;
  return (
    <li>
      <button type="button" className={className} onClick={() => window.googlefc?.showRevocationMessage?.()}>
        Privacy &amp; ad choices
      </button>
    </li>
  );
}
