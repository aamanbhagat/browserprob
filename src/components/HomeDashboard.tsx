"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { detectBrowser, type BrowserInfo } from "@/lib/detect/browser";
import { detectScreen, type ScreenInfo } from "@/lib/detect/screen";
import { detectNetwork, type NetworkInfo } from "@/lib/detect/network";
import { detectCanvas, type CanvasInfo } from "@/lib/detect/canvas";
import { detectWebGL, type WebGLInfo } from "@/lib/detect/webgl";
import { detectAudio, type AudioInfo } from "@/lib/detect/audio";
import { detectFonts, type FontInfo } from "@/lib/detect/fonts";
import { detectHardware, type HardwareInfo } from "@/lib/detect/hardware";
import { detectPrivacy, detectWebRTCLeak, type PrivacyInfo, type WebRTCLeak } from "@/lib/detect/privacy";
import { detectIP, type IPInfo } from "@/lib/detect/ip";
import { detectTimezone, type TimezoneInfo } from "@/lib/detect/timezone";
import { buildDiagnosticFindings } from "@/lib/diagnostic-findings";
import DataRow from "@/components/DataRow";
import ProbeAnimation from "@/components/ProbeAnimation";
import styles from "./dashboard.module.css";

interface AllData {
  browser: BrowserInfo;
  screen: ScreenInfo;
  network: NetworkInfo;
  canvas: CanvasInfo;
  webgl: WebGLInfo;
  audio: AudioInfo;
  fonts: FontInfo;
  hardware: HardwareInfo;
  privacy: PrivacyInfo;
  webrtc: WebRTCLeak;
  ip: IPInfo;
  timezone: TimezoneInfo;
  js: Record<string, boolean>;
  storage: Record<string, boolean>;
  plugins: { plugins: string[]; mimeTypes: number; pdfViewer: boolean };
  media: { supported: boolean; audioin: number; audioout: number; videoin: number; total: number; labelsVisible: boolean };
  features: { name: string; supported: boolean }[];
  secureContext: boolean;
  generatedAt: string;
  reportId: string;
}

const emptyWebRTC: WebRTCLeak = {
  addresses: [],
  publicIPs: [],
  privateIPs: [],
  mdnsProtected: false,
  supported: false,
  status: "not-supported",
  summary: "WebRTC is unavailable in this browser.",
};

function createReportId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `BP-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  }
  return `BP-${Date.now().toString(36).toUpperCase()}`;
}

function checkStorage(): Record<string, boolean> {
  let cookie = false;
  let local = false;
  let session = false;

  try {
    document.cookie = "_bp_probe=1; Path=/; SameSite=Lax";
    cookie = document.cookie.split(";").some((item) => item.trim() === "_bp_probe=1");
    document.cookie = "_bp_probe=; Max-Age=0; Path=/; SameSite=Lax";
  } catch { /* Browser policy blocked the write. */ }

  try {
    localStorage.setItem("_bp_probe", "1");
    local = localStorage.getItem("_bp_probe") === "1";
    localStorage.removeItem("_bp_probe");
  } catch { /* Browser policy blocked the write. */ }

  try {
    sessionStorage.setItem("_bp_probe", "1");
    session = sessionStorage.getItem("_bp_probe") === "1";
    sessionStorage.removeItem("_bp_probe");
  } catch { /* Browser policy blocked the write. */ }

  return {
    firstPartyCookie: cookie,
    localStorage: local,
    sessionStorage: session,
    indexedDB: typeof indexedDB !== "undefined",
  };
}

function detectFeatures(): { name: string; supported: boolean }[] {
  return [
    { name: "WebSocket", supported: typeof WebSocket !== "undefined" },
    { name: "Fetch API", supported: typeof fetch !== "undefined" },
    { name: "Service Worker", supported: "serviceWorker" in navigator },
    { name: "Web Workers", supported: typeof Worker !== "undefined" },
    { name: "WebAssembly", supported: typeof WebAssembly !== "undefined" },
    { name: "IndexedDB", supported: typeof indexedDB !== "undefined" },
    { name: "Web Crypto", supported: typeof crypto?.subtle !== "undefined" },
    { name: "Geolocation", supported: "geolocation" in navigator },
    { name: "Notifications", supported: "Notification" in window },
    { name: "Push API", supported: "PushManager" in window },
    { name: "Clipboard API", supported: "clipboard" in navigator },
    { name: "Fullscreen", supported: "fullscreenEnabled" in document },
    { name: "Gamepad", supported: "getGamepads" in navigator },
    { name: "Vibration", supported: "vibrate" in navigator },
    { name: "Bluetooth", supported: "bluetooth" in navigator },
    { name: "USB", supported: "usb" in navigator },
    { name: "Web Share", supported: "share" in navigator },
    { name: "Payment Request", supported: "PaymentRequest" in window },
    { name: "Intersection Observer", supported: typeof IntersectionObserver !== "undefined" },
    { name: "Resize Observer", supported: typeof ResizeObserver !== "undefined" },
    { name: "Web Animations", supported: typeof Element.prototype.animate !== "undefined" },
    { name: "Screen Wake Lock", supported: "wakeLock" in navigator },
    { name: "WebRTC", supported: typeof RTCPeerConnection !== "undefined" },
    { name: "Canvas 2D", supported: !!document.createElement("canvas").getContext("2d") },
    { name: "WebGL", supported: !!document.createElement("canvas").getContext("webgl") },
    { name: "WebGL 2.0", supported: !!document.createElement("canvas").getContext("webgl2") },
  ];
}

function reportText(data: AllData): string {
  return [
    `BrowserProbe report ${data.reportId}`,
    `Generated: ${data.generatedAt}`,
    `Browser: ${data.browser.name} ${data.browser.version}`,
    `Engine: ${data.browser.engine} ${data.browser.engineVersion}`,
    `Public IP: ${data.ip.ip}`,
    `Timezone: ${data.timezone.timezone} (${data.timezone.utcOffset})`,
    `Screen: ${data.screen.screenWidth} × ${data.screen.screenHeight}`,
    `WebRTC: ${data.webrtc.summary}`,
    `Canvas sample: ${data.canvas.fingerprint}`,
    `Audio sample: ${data.audio.fingerprint}`,
    "Note: browser-reported values can be reduced, frozen, or spoofed. Results describe this session, not a verified physical device.",
  ].join("\n");
}

type DashboardIcon =
  | "overview"
  | "identity"
  | "network"
  | "privacy"
  | "display"
  | "features"
  | "media"
  | "storage"
  | "security"
  | "advanced"
  | "export"
  | "print";

function LineIcon({ name }: { name: DashboardIcon }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (name === "overview") return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2" {...common} /><path d="M8 8v8M5.5 12h5M14 8h4M14 12h4M14 16h3" {...common} /></svg>;
  if (name === "identity") return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" {...common} /><path d="m8 12 2.5 2.5L16.5 8" {...common} /></svg>;
  if (name === "network") return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" {...common} /><path d="M3 12h18M12 3c2.4 2.5 3.5 5.5 3.5 9S14.4 18.5 12 21M12 3C9.6 5.5 8.5 8.5 8.5 12S9.6 18.5 12 21" {...common} /></svg>;
  if (name === "privacy" || name === "security") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 20 6v5c0 5.1-3.3 8.3-8 10-4.7-1.7-8-4.9-8-10V6l8-3Z" {...common} /><path d="m8.5 12 2.2 2.2 4.8-5" {...common} /></svg>;
  if (name === "display") return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="14" rx="2" {...common} /><path d="M8 21h8M12 18v3" {...common} /></svg>;
  if (name === "features") return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" {...common} /><path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3" {...common} /></svg>;
  if (name === "media") return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2" {...common} /><path d="m8 16 3-8 3 8M9.2 13h3.6M16 9h2M17 8v5" {...common} /></svg>;
  if (name === "storage") return <svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="5" rx="8" ry="3" {...common} /><path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7" {...common} /></svg>;
  if (name === "advanced") return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3" {...common} /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" {...common} /></svg>;
  if (name === "export") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z" {...common} /><path d="M14 3v6h6M12 12v6M9.5 15.5 12 18l2.5-2.5" {...common} /></svg>;
  if (name === "print") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 9V3h10v6M7 18H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" {...common} /><path d="M7 14h10v7H7z" {...common} /></svg>;
  return null;
}

function FingerprintMark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M8.1 26.5c2.8-3.5 3.7-7.6 3.7-12.4a4.2 4.2 0 0 1 8.4 0c0 6.7-1.8 12-5.5 16" />
      <path d="M3.8 21.8c1.9-2.8 2.9-6.2 2.9-10a9.3 9.3 0 0 1 18.6 0c0 7.5-2 13.5-6.1 18" />
      <path d="M2.8 13.2A13.2 13.2 0 0 1 29 11.6c0 4.8-.7 9.1-2.2 12.7M10.6 3.7a13 13 0 0 1 8.8-.8" />
    </svg>
  );
}

const sidebarItems: { label: string; href: string; icon: DashboardIcon }[] = [
  { label: "Overview", href: "#report-summary", icon: "overview" },
  { label: "Browser identity", href: "#browser-identity", icon: "identity" },
  { label: "Network", href: "#network", icon: "network" },
  { label: "Privacy checks", href: "#privacy-checks", icon: "privacy" },
  { label: "Display", href: "#display-device", icon: "display" },
  { label: "Web features", href: "/tools/browser-features", icon: "features" },
  { label: "Fonts & media", href: "/tools/media-devices", icon: "media" },
  { label: "Storage", href: "/tools/cookies-test", icon: "storage" },
  { label: "Security", href: "/privacy-policy", icon: "security" },
  { label: "Advanced", href: "/tools/hardware-info", icon: "advanced" },
];

const deepDiveItems: { title: string; description: string; href: string; icon: DashboardIcon }[] = [
  { title: "Fingerprint analysis", description: "See the repeatable browser surfaces in this session.", href: "/tools/canvas-fingerprint", icon: "privacy" },
  { title: "Network & WebRTC", description: "Inspect the connection, IP comparison, and ICE results.", href: "/tools/webrtc-leak-test", icon: "network" },
  { title: "Storage inspector", description: "Check cookies, storage APIs, and local availability.", href: "/tools/cookies-test", icon: "storage" },
  { title: "Privacy signals", description: "Review DNT, GPC, permissions, and their limits.", href: "/tools/do-not-track", icon: "security" },
  { title: "Fonts & media", description: "Explore font exposure and permission-gated devices.", href: "/tools/media-devices", icon: "media" },
];

function AppSidebar({ busy, onDownload, onPrint }: { busy: boolean; onDownload: () => void; onPrint: () => void }) {
  return (
    <aside className={styles.appSidebar} aria-label="BrowserProbe report navigation">
      <Link className={styles.brand} href="/" aria-label="BrowserProbe home">
        <span className={styles.brandMark}><FingerprintMark /></span>
        <span>BrowserProbe</span>
      </Link>

      <nav className={styles.appNavigation} aria-label="Report sections">
        {sidebarItems.map((item, index) => (
          <Link className={index === 0 ? styles.activeNavItem : ""} href={item.href} key={item.label} aria-current={index === 0 ? "page" : undefined}>
            <span className={styles.navIcon}><LineIcon name={item.icon} /></span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className={styles.sidebarFooter}>
        <div className={styles.sidebarActions}>
          <button type="button" onClick={onDownload} disabled={busy}><LineIcon name="export" />Export report</button>
          <button type="button" onClick={onPrint} disabled={busy}><LineIcon name="print" />Print report</button>
        </div>
        <p><span>BrowserProbe</span><span>v0.1.0</span></p>
        <small>Diagnostics you can trust.</small>
      </div>
    </aside>
  );
}

function PageIntro({ data }: { data: AllData | null }) {
  return (
    <header className={styles.pageIntro}>
      <div>
        <h1>Your browser, explained.</h1>
        <p>Instant diagnostics and privacy insights for your current browser.</p>
      </div>
      <dl className={styles.introMeta}>
        <div><dt>Report generated</dt><dd>{data?.generatedAt ?? "Preparing live report…"}</dd></div>
        <div><dt>Test ID</dt><dd>{data?.reportId ?? "BP-PREPARING"}</dd></div>
      </dl>
    </header>
  );
}

function DeepDiveCards() {
  return (
    <section className={styles.deepDive} aria-labelledby="deep-dive-title">
      <div className={styles.deepDiveHeading}>
        <h2 id="deep-dive-title">Deep-dive tools</h2>
        <span>Explore key areas in detail</span>
      </div>
      <div className={styles.deepDiveGrid}>
        {deepDiveItems.map((item) => (
          <Link href={item.href} key={item.title}>
            <span className={styles.deepDiveIcon}><LineIcon name={item.icon} /></span>
            <span><strong>{item.title}</strong><small>{item.description}</small></span>
            <b aria-hidden="true">›</b>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function HomeDashboard() {
  const [data, setData] = useState<AllData | null>(null);
  const [progress, setProgress] = useState(0);
  const [scanNumber, setScanNumber] = useState(0);
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function runAllProbes() {
      setData(null);
      setProgress(4);

      const browser = detectBrowser();
      const screen = detectScreen();
      const network = detectNetwork();
      const canvas = detectCanvas();
      setProgress(24);

      const webgl = detectWebGL();
      const fonts = detectFonts();
      const privacy = detectPrivacy();
      const timezone = detectTimezone();
      const storage = checkStorage();
      const features = detectFeatures();
      const js = {
        webWorkers: typeof Worker !== "undefined",
        serviceWorkers: "serviceWorker" in navigator,
        webAssembly: typeof WebAssembly !== "undefined",
        fetch: typeof fetch !== "undefined",
        promises: typeof Promise !== "undefined",
        bigInt: typeof BigInt !== "undefined",
      };
      setProgress(56);

      const pluginNames = Array.from(navigator.plugins || [], (plugin) => plugin.name);
      const plugins = {
        plugins: pluginNames,
        mimeTypes: navigator.mimeTypes?.length || 0,
        pdfViewer: navigator.pdfViewerEnabled ?? pluginNames.some((plugin) => plugin.toLowerCase().includes("pdf")),
      };

      let media = { supported: false, audioin: 0, audioout: 0, videoin: 0, total: 0, labelsVisible: false };
      try {
        if (navigator.mediaDevices?.enumerateDevices) {
          const devices = await navigator.mediaDevices.enumerateDevices();
          media = {
            supported: true,
            audioin: devices.filter((device) => device.kind === "audioinput").length,
            audioout: devices.filter((device) => device.kind === "audiooutput").length,
            videoin: devices.filter((device) => device.kind === "videoinput").length,
            total: devices.length,
            labelsVisible: devices.some((device) => Boolean(device.label)),
          };
        }
      } catch { /* Permission or browser policy blocked enumeration. */ }
      setProgress(68);

      const withTimeout = <T,>(promise: Promise<T>, fallback: T, milliseconds = 4500): Promise<T> =>
        Promise.race([promise, new Promise<T>((resolve) => setTimeout(() => resolve(fallback), milliseconds))]);

      const audioFallback: AudioInfo = { supported: false, fingerprint: "N/A", sampleRate: 0, channelCount: 0, state: "timeout" };
      const hardwareFallback: HardwareInfo = {
        cpuCores: navigator.hardwareConcurrency || 0,
        deviceMemory: "Not available",
        maxTouchPoints: navigator.maxTouchPoints || 0,
        platform: navigator.platform || "Unknown",
        gpu: "Not available",
        batteryStatus: "Not available",
        batteryLevel: "Not available",
        batteryCharging: "Not available",
      };
      const ipFallback: IPInfo = { ip: "Unable to detect", ipv4: "Not detected", ipv6: "Not detected", source: "unavailable" };

      const [audio, hardware, webrtc, ip] = await Promise.all([
        withTimeout(detectAudio(), audioFallback),
        withTimeout(detectHardware(), hardwareFallback),
        withTimeout(detectWebRTCLeak(), emptyWebRTC),
        withTimeout(detectIP(), ipFallback),
      ]);

      if (cancelled) return;
      setProgress(100);
      setData({
        browser,
        screen,
        network,
        canvas,
        webgl,
        audio,
        fonts,
        hardware,
        privacy,
        webrtc,
        ip,
        timezone,
        js,
        storage,
        plugins,
        media,
        features,
        secureContext: window.isSecureContext,
        generatedAt: new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "medium" }).format(new Date()),
        reportId: createReportId(),
      });
    }

    runAllProbes();
    return () => { cancelled = true; };
  }, [scanNumber]);

  const findings = useMemo(() => data ? buildDiagnosticFindings({
    globalPrivacyControl: data.privacy.globalPrivacyControl,
    doNotTrack: data.privacy.doNotTrack,
    webrtc: data.webrtc,
    canvasSupported: data.canvas.supported,
    audioSupported: data.audio.supported,
    detectedFontCount: data.fonts.detectedFonts.length,
    mediaLabelsVisible: data.media.labelsVisible,
  }) : [], [data]);

  if (!data) {
    return (
      <div className={styles.appShell}>
        <AppSidebar busy onDownload={() => undefined} onPrint={() => undefined} />
        <div className={styles.appMain}>
          <PageIntro data={null} />
          <div className={styles.loadingShell} aria-live="polite" aria-busy="true">
            <div className={styles.loadingReport}>
              <div className={styles.loadingHeading}>
                <span>Generating diagnostic passport</span>
                <strong>{progress}%</strong>
              </div>
              <div className={styles.loadingBody}>
                <ProbeAnimation />
                <p>Checking browser identity, privacy signals, network exposure, storage, and graphics.</p>
              </div>
              <div className={styles.progressTrack}><span style={{ width: `${progress}%` }} /></div>
            </div>
            <aside className={styles.loadingSummary} aria-hidden="true">
              <span />
              <i />
              <i />
              <i />
            </aside>
          </div>
        </div>
      </div>
    );
  }

  const featuresSupported = data.features.filter((feature) => feature.supported).length;
  const reportChecks = [
    {
      id: "secure-context",
      status: data.secureContext ? "pass" as const : "review" as const,
      title: data.secureContext ? "Encrypted connection context" : "Secure context is unavailable",
      summary: data.secureContext ? "The browser exposes this page as a secure context." : "Sensitive browser APIs can be restricted outside HTTPS.",
      source: "Secure Context API",
      confidence: "high",
      href: "/privacy-policy",
    },
    {
      id: "first-party-storage",
      status: data.storage.firstPartyCookie && data.storage.localStorage ? "pass" as const : "limited" as const,
      title: "First-party storage access",
      summary: data.storage.firstPartyCookie && data.storage.localStorage ? "The temporary cookie and local-storage checks succeeded." : "At least one local storage mechanism is restricted.",
      source: "Storage checks",
      confidence: "high",
      href: "/tools/cookies-test",
    },
    ...findings,
    {
      id: "ipv6-visibility",
      status: data.ip.ipv6 !== "Not detected" ? "info" as const : "limited" as const,
      title: data.ip.ipv6 !== "Not detected" ? "IPv6 address is visible to this request" : "No IPv6 address was detected",
      summary: data.ip.ipv6 !== "Not detected" ? "The address is reported as connection data, not automatically as a privacy leak." : "The connection may be IPv4-only or IPv6 may be unavailable.",
      source: "IP endpoint",
      confidence: "high",
      href: "/tools/what-is-my-ip",
    },
    {
      id: "feature-surface",
      status: "info" as const,
      title: "Web feature surface",
      summary: `${featuresSupported} of ${data.features.length} tested APIs are exposed by this browser.`,
      source: "Feature presence",
      confidence: "high",
      href: "/tools/browser-features",
    },
  ];

  const counts = reportChecks.reduce((result, finding) => {
    result[finding.status] += 1;
    return result;
  }, { pass: 0, review: 0, limited: 0, info: 0 });
  const verdict = counts.review > 0 ? "Attention recommended" : "No urgent finding detected";
  const findingsToReview = counts.review + counts.limited;
  const exposureScore = Math.min(100, counts.review * 22 + counts.limited * 10 + counts.info * 6);
  const exposureLabel = exposureScore >= 70 ? "High exposure" : exposureScore >= 35 ? "Moderate exposure" : "Low exposure";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reportText(data));
      setActionMessage("Report copied");
    } catch {
      setActionMessage("Clipboard access is unavailable");
    }
  };

  const handleDownload = () => {
    const payload = JSON.stringify({
      report: data,
      findings: reportChecks,
      disclaimer: "Browser-reported values can be reduced, frozen, or spoofed. Results describe this session, not a verified physical device.",
    }, null, 2);
    const url = URL.createObjectURL(new Blob([payload], { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `browserprobe-${data.reportId.toLowerCase()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setActionMessage("JSON report downloaded");
  };

  return (
    <div className={styles.appShell}>
      <AppSidebar busy={false} onDownload={handleDownload} onPrint={() => window.print()} />
      <div className={styles.appMain}>
        <PageIntro data={data} />
        <div className={styles.workspace}>
          <article className={styles.report} id="report-summary" aria-labelledby="report-title">
        <header className={styles.reportHeader}>
          <div className={styles.reportIdentity}>
            <span className={styles.passportMark} aria-hidden="true"><LineIcon name="network" /></span>
            <div><p>Diagnostic passport</p><span>Browser inspection report</span></div>
          </div>
          <div className={styles.verdict}>
            <span className={counts.review > 0 ? styles.verdictReview : styles.verdictPass}>{verdict}</span>
            <small>{findingsToReview > 0 ? `${findingsToReview} findings to review` : "No urgent issue found in this scan"}</small>
          </div>
          <div className={styles.reportStamp} aria-label={`Report ${data.reportId}`}>
            <span>BrowserProbe</span><strong>{new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date())}</strong><span>Inspected</span>
          </div>
        </header>

        <div className={styles.primaryGrid}>
          <section className={styles.reportSection} id="browser-identity">
            <h2>Browser identity</h2>
            <div className={styles.browserHero}>
              <span className={styles.browserOrb} aria-hidden="true"><i /></span>
              <div><strong>{data.browser.name}</strong><span>Version {data.browser.version}</span></div>
            </div>
            <div className={styles.compactUserAgent}><span>User agent</span><code>{data.browser.userAgent}</code></div>
            <DataRow compact label="Engine" value={`${data.browser.engine} ${data.browser.engineVersion}`} />
            <DataRow compact label="Platform" value={data.browser.platform} />
            <DataRow compact label="Cookies" value={data.storage.firstPartyCookie ? "Enabled" : "Restricted"} mono={false} />
            <DataRow compact label="Do Not Track" value={data.privacy.doNotTrack} mono={false} />
          </section>

          <section className={styles.reportSection} id="network">
            <h2>Network</h2>
            <DataRow compact label="IP address" value={data.ip.ip} />
            <DataRow compact label="IPv4" value={data.ip.ipv4} />
            <DataRow compact label="IPv6" value={data.ip.ipv6} />
            <DataRow compact label="Connection" value={data.network.effectiveType} />
            <DataRow compact label="Downlink hint" value={data.network.downlink} />
            <DataRow compact label="WebRTC" value={data.webrtc.status.replaceAll("-", " ")} mono={false} />
          </section>

          <section className={styles.reportSection} id="display-device">
            <h2>Display</h2>
            <DataRow compact label="Screen resolution" value={`${data.screen.screenWidth} × ${data.screen.screenHeight}`} />
            <DataRow compact label="Viewport" value={`${data.screen.viewportWidth} × ${data.screen.viewportHeight}`} />
            <DataRow compact label="Device pixel ratio" value={data.screen.devicePixelRatio} />
            <DataRow compact label="Color depth" value={`${data.screen.colorDepth}-bit`} />
            <DataRow compact label="Orientation" value={data.screen.orientation} />
            <DataRow compact label="Touch support" value={data.screen.touchSupport} />
          </section>
        </div>

        <section className={styles.findingTable} id="privacy-checks">
          <div className={styles.sectionHeading}>
            <div><p>Privacy checks</p><span>Observed facts, browser signals, and explicit limits</span></div>
          </div>
          <div className={styles.findingRows}>
            {reportChecks.map((finding) => (
              <div className={styles.findingRow} key={finding.id}>
                <span className={styles.findingIcon} aria-hidden="true"><LineIcon name={finding.status === "pass" ? "security" : finding.status === "review" ? "privacy" : "features"} /></span>
                <strong><Link href={finding.href}>{finding.title}</Link></strong>
                <p>{finding.summary}</p>
                <span className={styles.evidence}>{finding.source}</span>
                <span className={`${styles.statusBadge} ${styles[finding.status]}`}>{finding.status}</span>
              </div>
            ))}
          </div>
        </section>

        <footer className={styles.reportFooter}>
          <span><strong>Method</strong>Passive browser APIs + IP and STUN checks</span>
          <span><strong>Scope</strong>Current browser session</span>
          <span><strong>Disclaimer</strong>Values can be reduced, frozen, or spoofed</span>
        </footer>
      </article>

          <aside className={styles.summaryPanel} aria-labelledby="report-title">
        <div className={styles.summaryHeader}><p>Summary</p><button type="button" onClick={() => setScanNumber((number) => number + 1)}>Re-run</button></div>
        <p className={styles.scoreTitle} id="report-title">Your exposure score <span title="A heuristic summary of the explicit checks below—not an anonymity score.">i</span></p>
        <div className={styles.coverageRing} style={{ "--coverage": `${exposureScore * 3.6}deg`, "--ring-color": counts.review > 0 ? "var(--accent-orange)" : "var(--accent-teal)" } as CSSProperties}>
          <div><strong>{exposureScore}</strong><span>/100</span></div>
        </div>
        <p className={`${styles.coverageLabel} ${counts.review > 0 ? styles.exposureReview : styles.exposureLow}`}>{exposureLabel}</p>
        <p className={styles.coverageNote}>Heuristic summary of this report. It is not a universal privacy or anonymity score.</p>

        <div className={styles.summaryCounts}>
          <span><strong>{counts.pass}</strong>Pass</span>
          <span><strong>{counts.review}</strong>Review</span>
          <span><strong>{counts.limited}</strong>Limited</span>
        </div>

        <div className={styles.summaryFindings}>
          <p>{counts.review > 0 ? "Your browser is functional, but a few findings deserve context. Review the evidence before changing privacy settings." : "No urgent issue appeared, but feature availability and privacy are not the same thing."}</p>
        </div>

        <a className={styles.reviewButton} href="#privacy-checks">Review {findingsToReview} findings <span aria-hidden="true">›</span></a>

        <nav className={styles.summaryLinks} aria-label="Report help">
          <a href="#privacy-checks"><span>ⓘ</span>What&apos;s this score?<b>›</b></a>
          <Link href="/about"><span>◇</span>How we test<b>›</b></Link>
          <Link href="/blog"><span>▧</span>Privacy guides<b>›</b></Link>
          <button type="button" onClick={handleCopy}><span>↗</span>Share your report<b>›</b></button>
        </nav>
        <p className={styles.actionMessage} aria-live="polite">{actionMessage}</p>

        <div className={styles.localNote}>
          <span className={styles.localNoteIcon}><LineIcon name="security" /></span>
          <div><strong>Your report stays local</strong>
          <p>BrowserProbe does not store the assembled scan. Third-party monetization code still runs as disclosed.</p>
          <Link href="/privacy-policy">Read the privacy method</Link></div>
        </div>
      </aside>
        </div>
        <DeepDiveCards />
      </div>
    </div>
  );
}
