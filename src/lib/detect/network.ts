import { NOT_SUPPORTED } from "@/lib/detect/hardware";

export interface NetworkInfo {
  supported: boolean;
  effectiveType: string;
  downlink: string;
  rtt: string;
  saveData: string;
  type: string;
  online: boolean;
}

interface NavigatorWithConnection extends Navigator {
  connection?: {
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
    saveData?: boolean;
    type?: string;
  };
}

export function detectNetwork(): NetworkInfo {
  const conn = (navigator as NavigatorWithConnection).connection;
  const supported = Boolean(conn);

  return {
    supported,
    effectiveType: conn?.effectiveType || NOT_SUPPORTED,
    downlink: conn?.downlink !== undefined ? `${conn.downlink} Mbps (estimate, capped at 10)` : NOT_SUPPORTED,
    rtt: conn?.rtt !== undefined ? `${conn.rtt} ms (estimate)` : NOT_SUPPORTED,
    saveData: conn?.saveData !== undefined ? (conn.saveData ? "On" : "Off") : NOT_SUPPORTED,
    // Chromium only reports the connection technology on ChromeOS and Android.
    type: conn?.type || (supported ? "Not reported on this platform" : NOT_SUPPORTED),
    online: navigator.onLine,
  };
}

export interface NavigationTimingSummary {
  protocol: string;
  /** Milliseconds, or null when the phase did not happen or the browser zeroes it. */
  dns: number | null;
  connect: number | null;
  tls: number | null;
  ttfb: number | null;
  download: number | null;
  total: number | null;
  transferSize: number | null;
  navigationType: string;
}

type TimingLike = Pick<
  PerformanceNavigationTiming,
  | "nextHopProtocol" | "domainLookupStart" | "domainLookupEnd" | "connectStart" | "connectEnd" | "secureConnectionStart"
  | "requestStart" | "responseStart" | "responseEnd" | "startTime" | "transferSize" | "type"
>;

const duration = (start: number, end: number): number | null =>
  start > 0 && end >= start ? Math.round(end - start) : null;

const PROTOCOL_NAMES: Record<string, string> = { h3: "HTTP/3", h2: "HTTP/2", "http/1.1": "HTTP/1.1", "http/1.0": "HTTP/1.0" };

/** Summarizes the navigation entry for the document load that started this tab's session on the site. */
export function summarizeNavigationTiming(entry: TimingLike | undefined): NavigationTimingSummary | null {
  if (!entry) return null;
  const protocol = entry.nextHopProtocol ? PROTOCOL_NAMES[entry.nextHopProtocol] || entry.nextHopProtocol : "Not reported";
  return {
    protocol,
    // A reused connection or cached DNS lookup reports start === end, which rounds to 0.
    dns: duration(entry.domainLookupStart, entry.domainLookupEnd),
    connect: duration(entry.connectStart, entry.connectEnd),
    tls: entry.secureConnectionStart > 0 ? duration(entry.secureConnectionStart, entry.connectEnd) : null,
    ttfb: duration(entry.requestStart, entry.responseStart),
    download: duration(entry.responseStart, entry.responseEnd),
    total: entry.responseEnd > 0 ? Math.round(entry.responseEnd - entry.startTime) : null,
    transferSize: entry.transferSize > 0 ? entry.transferSize : null,
    navigationType: entry.type || "navigate",
  };
}

export function detectNavigationTiming(): NavigationTimingSummary | null {
  if (typeof performance === "undefined" || typeof performance.getEntriesByType !== "function") return null;
  return summarizeNavigationTiming(performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined);
}
