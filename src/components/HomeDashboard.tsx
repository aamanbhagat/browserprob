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
      <div className={styles.loadingShell} aria-live="polite" aria-busy="true">
        <div className={styles.loadingReport}>
          <div className={styles.loadingHeading}>
            <span>Generating diagnostic passport</span>
            <strong>{progress}%</strong>
          </div>
          <div className={styles.loadingBody}>
            <ProbeAnimation />
            <p>Checking browser-reported identity, privacy signals, network exposure, storage, and graphics.</p>
          </div>
          <div className={styles.progressTrack}><span style={{ width: `${progress}%` }} /></div>
        </div>
      </div>
    );
  }

  const counts = findings.reduce((result, finding) => {
    result[finding.status] += 1;
    return result;
  }, { pass: 0, review: 0, limited: 0, info: 0 });
  const verdict = counts.review > 0 ? "Attention recommended" : "No urgent finding detected";
  const featuresSupported = data.features.filter((feature) => feature.supported).length;
  const protectionTotal = counts.pass + counts.review + counts.limited;
  const coverage = protectionTotal > 0 ? Math.round((counts.pass / protectionTotal) * 100) : 0;

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
      findings,
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
    <div className={styles.workspace}>
      <aside className={styles.sectionRail} aria-label="Report sections">
        <p className={styles.railLabel}>Report sections</p>
        <nav>
          <a href="#report-summary">Summary</a>
          <a href="#browser-identity">Browser identity</a>
          <a href="#network">Network</a>
          <a href="#privacy-checks">Privacy checks</a>
          <a href="#display-device">Display & device</a>
          <a href="#web-features">Web features</a>
        </nav>
        <div className={styles.railActions}>
          <button type="button" onClick={handleDownload}>Download JSON</button>
          <button type="button" onClick={() => window.print()}>Print report</button>
        </div>
      </aside>

      <article className={styles.report} id="report-summary" aria-labelledby="report-title">
        <header className={styles.reportHeader}>
          <div className={styles.reportIdentity}>
            <span className={styles.passportMark} aria-hidden="true">BP</span>
            <div><p>Diagnostic passport</p><span>Browser inspection report</span></div>
          </div>
          <div className={styles.verdict}>
            <span className={counts.review > 0 ? styles.verdictReview : styles.verdictPass}>{verdict}</span>
            <small>{counts.review > 0 ? `${counts.review} findings to review` : "No urgent issue found in this scan"}</small>
          </div>
          <div className={styles.reportStamp} aria-label={`Report ${data.reportId}`}>
            <span>Inspected</span><strong>{data.reportId.replace("BP-", "")}</strong><span>Local scan</span>
          </div>
        </header>

        <div className={styles.reportMeta}>
          <span>Generated <strong>{data.generatedAt}</strong></span>
          <span>Report ID <strong>{data.reportId}</strong></span>
          <span>Modules complete <strong>17 / 17</strong></span>
        </div>

        <div className={styles.primaryGrid}>
          <section className={styles.reportSection} id="browser-identity">
            <h2>Browser identity</h2>
            <DataRow label="Browser" value={`${data.browser.name} ${data.browser.version}`} />
            <DataRow label="Engine" value={`${data.browser.engine} ${data.browser.engineVersion}`} />
            <DataRow label="Platform" value={data.browser.platform} />
            <DataRow label="Device class" value={data.browser.mobile ? "Mobile" : "Desktop / tablet"} mono={false} />
            <DataRow label="Language" value={data.browser.language} />
          </section>

          <section className={styles.reportSection} id="network">
            <h2>Network</h2>
            <DataRow label="Detected IP" value={data.ip.ip} />
            <DataRow label="IPv4" value={data.ip.ipv4} />
            <DataRow label="IPv6" value={data.ip.ipv6} />
            <DataRow label="Connection hint" value={data.network.effectiveType} />
            <DataRow label="WebRTC" value={data.webrtc.status.replaceAll("-", " ")} mono={false} />
          </section>

          <section className={styles.reportSection} id="display-device">
            <h2>Display</h2>
            <DataRow label="Screen" value={`${data.screen.screenWidth} × ${data.screen.screenHeight}`} />
            <DataRow label="Viewport" value={`${data.screen.viewportWidth} × ${data.screen.viewportHeight}`} />
            <DataRow label="Pixel ratio" value={data.screen.devicePixelRatio} />
            <DataRow label="Color depth" value={`${data.screen.colorDepth}-bit`} />
            <DataRow label="Touch" value={data.screen.touchSupport} />
          </section>
        </div>

        <div className={styles.userAgentRow}><span>User agent</span><code>{data.browser.userAgent}</code></div>

        <section className={styles.findingTable} id="privacy-checks">
          <div className={styles.sectionHeading}>
            <div><p>Privacy checks</p><span>Observed facts are separated from interpretation.</span></div>
            <Link href="/tools/do-not-track">Open privacy tools</Link>
          </div>
          <div className={styles.findingRows}>
            {findings.map((finding) => (
              <div className={styles.findingRow} key={finding.id}>
                <span className={`${styles.statusBadge} ${styles[finding.status]}`}>{finding.status}</span>
                <div><strong>{finding.title}</strong><p>{finding.summary}</p></div>
                <span className={styles.evidence}>{finding.source}<small>{finding.confidence} confidence</small></span>
                <Link href={finding.href}>Details</Link>
              </div>
            ))}
          </div>
        </section>

        <div className={styles.secondaryGrid}>
          <section className={styles.reportSection}>
            <h2>Hardware & fingerprint surfaces</h2>
            <DataRow label="CPU concurrency" value={data.hardware.cpuCores || null} />
            <DataRow label="Memory hint" value={data.hardware.deviceMemory} />
            <DataRow label="GPU renderer" value={data.webgl.renderer} />
            <DataRow label="Canvas sample" value={data.canvas.fingerprint} />
            <DataRow label="Audio sample" value={data.audio.fingerprint} />
            <DataRow label="Tested fonts found" value={`${data.fonts.detectedFonts.length} / ${data.fonts.totalTested}`} />
          </section>

          <section className={styles.reportSection}>
            <h2>Storage & permission visibility</h2>
            <DataRow label="First-party cookie" value={data.storage.firstPartyCookie} />
            <DataRow label="Local storage" value={data.storage.localStorage} />
            <DataRow label="Session storage" value={data.storage.sessionStorage} />
            <DataRow label="IndexedDB API" value={data.storage.indexedDB} />
            <DataRow label="Media devices" value={data.media.total} />
            <DataRow label="Device labels" value={data.media.labelsVisible ? "Visible" : "Permission-limited"} mono={false} />
          </section>
        </div>

        <details className={styles.featureDisclosure} id="web-features">
          <summary><span>Web feature support</span><strong>{featuresSupported} / {data.features.length} APIs present</strong></summary>
          <p>Presence means the browser exposes the API. It does not guarantee permission, policy access, or successful operation.</p>
          <div className={styles.featureGrid}>
            {data.features.map((feature) => (
              <span key={feature.name} className={feature.supported ? styles.featureYes : styles.featureNo}>
                {feature.name}<strong>{feature.supported ? "Available" : "Unavailable"}</strong>
              </span>
            ))}
          </div>
        </details>

        <footer className={styles.reportFooter}>
          <span>Method: passive browser APIs + one IP request + a public STUN check</span>
          <span>Scope: this browser session</span>
          <span>Values can be frozen, reduced, or spoofed</span>
        </footer>
      </article>

      <aside className={styles.summaryPanel} aria-labelledby="report-title">
        <div className={styles.summaryHeader}><p>Report summary</p><button type="button" onClick={() => setScanNumber((number) => number + 1)}>Re-run</button></div>
        <div className={styles.coverageRing} style={{ "--coverage": `${coverage * 3.6}deg` } as CSSProperties}>
          <div><strong>{counts.pass}</strong><span>positive signals</span></div>
        </div>
        <p className={styles.coverageLabel}>Observed protection signals</p>
        <p className={styles.coverageNote}>This is a count of explicit checks, not a universal privacy score.</p>

        <div className={styles.summaryCounts}>
          <span><strong>{counts.pass}</strong>Pass</span>
          <span><strong>{counts.review}</strong>Review</span>
          <span><strong>{counts.limited}</strong>Limited</span>
        </div>

        <div className={styles.summaryFindings}>
          <h2 id="report-title">{verdict}</h2>
          <p>{counts.review > 0 ? "Review the evidence below before changing browser or network settings." : "No urgent issue appeared, but availability and privacy are not the same thing."}</p>
          {findings.filter((finding) => finding.status === "review").slice(0, 3).map((finding) => (
            <Link href={finding.href} key={finding.id}>{finding.title}<span>→</span></Link>
          ))}
        </div>

        <button type="button" className={styles.copyReport} onClick={handleCopy}>Copy report</button>
        <p className={styles.actionMessage} aria-live="polite">{actionMessage}</p>

        <div className={styles.localNote}>
          <strong>BrowserProbe does not store your report</strong>
          <p>Most checks run in this tab. Third-party monetization code also runs on the page; review the privacy method for the complete network disclosure.</p>
          <Link href="/privacy-policy">Read the privacy method</Link>
        </div>
      </aside>
    </div>
  );
}
