"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import DataRow from "@/components/DataRow";
import { detectAudio, type AudioInfo } from "@/lib/detect/audio";
import { detectBrowser } from "@/lib/detect/browser";
import { detectCanvas } from "@/lib/detect/canvas";
import { detectFeatures } from "@/lib/detect/features";
import { detectFonts } from "@/lib/detect/fonts";
import { detectIP, type IPInfo } from "@/lib/detect/ip";
import { listMediaDevices } from "@/lib/detect/media";
import { detectPrivacy, detectWebRTCLeak, type WebRTCLeak } from "@/lib/detect/privacy";
import { detectScreen } from "@/lib/detect/screen";
import { detectStorage } from "@/lib/detect/storage";
import { detectTimezone } from "@/lib/detect/timezone";
import { detectWebGL } from "@/lib/detect/webgl";
import { buildDiagnosticFindings, type DiagnosticFinding } from "@/lib/diagnostic-findings";
import { compareWebRtcWithIp } from "@/lib/webrtc-compare";
import styles from "./ScanReport.module.css";

const STATUS_LABEL: Record<DiagnosticFinding["status"], string> = {
  pass: "OK",
  review: "Worth a look",
  limited: "Limited",
  info: "Info",
};

const withTimeout = <T,>(promise: Promise<T>, fallback: T, milliseconds = 6000): Promise<T> =>
  Promise.race([promise, new Promise<T>((resolve) => setTimeout(() => resolve(fallback), milliseconds))]);

const ipFallback: IPInfo = { ip: null, version: null, scope: null, rangeLabel: null, source: null, location: null, status: "unavailable" };
const audioFallback: AudioInfo = { supported: false, fingerprint: "N/A", secondFingerprint: "N/A", sampleRate: 0, state: "timeout", renders: "unavailable" };
const webrtcFallback: WebRTCLeak = { addresses: [], publicIPs: [], privateIPs: [], mdnsProtected: false, supported: true, status: "error", summary: "The WebRTC check did not finish in time.", timedOut: true };

async function runScan() {
  const browser = detectBrowser();
  const screen = detectScreen();
  const timezone = detectTimezone();
  const privacy = detectPrivacy();
  const canvas = detectCanvas();
  const webgl = detectWebGL();
  const fonts = detectFonts();
  const features = detectFeatures();
  const [storage, media, audio, webrtc, ip] = await Promise.all([
    detectStorage(),
    listMediaDevices(),
    withTimeout(detectAudio(), audioFallback),
    withTimeout(detectWebRTCLeak(), webrtcFallback),
    withTimeout(detectIP(), ipFallback),
  ]);
  return {
    generatedAt: new Date().toISOString(),
    browser, screen, timezone, privacy, canvas, webgl, fonts, features, storage, media, audio, webrtc, ip,
    secureContext: window.isSecureContext,
  };
}

type Scan = Awaited<ReturnType<typeof runScan>>;

function reportText(scan: Scan, findings: DiagnosticFinding[]): string {
  return [
    `BrowserProbe report, ${scan.generatedAt}`,
    `Browser: ${scan.browser.name} ${scan.browser.version} (${scan.browser.engine})`,
    `IP address: ${scan.ip.ip ?? "not determined"}`,
    `Time zone: ${scan.timezone.timezone} (${scan.timezone.utcOffset})`,
    `Screen: ${scan.screen.screenWidth} × ${scan.screen.screenHeight} at ${scan.screen.devicePixelRatio}x`,
    ...findings.map((finding) => `${STATUS_LABEL[finding.status]}: ${finding.title}`),
    "Values are what this browser reported in this session. They can be rounded, frozen or spoofed.",
  ].join("\n");
}

export default function ScanReport() {
  const [scan, setScan] = useState<Scan | null>(null);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState("");

  const start = async () => {
    setRunning(true);
    setMessage("");
    try {
      setScan(await runScan());
    } catch {
      setMessage("The check stopped unexpectedly. Your browser may have blocked one of the APIs; try again or open a single test below.");
    } finally {
      setRunning(false);
    }
  };

  const findings = useMemo(() => {
    if (!scan) return [];
    const storageOk = scan.storage.firstPartyCookie === "works" && scan.storage.localStorage === "works";
    return [
      {
        id: "secure-context",
        title: scan.secureContext ? "The page is a secure context" : "The page is not a secure context",
        summary: scan.secureContext ? "Browsers only expose powerful APIs over HTTPS; this page qualifies." : "Several APIs are withheld outside HTTPS, so some results are missing.",
        status: scan.secureContext ? "pass" : "limited",
        source: "window.isSecureContext",
        confidence: "High",
        href: "/tools/browser-features",
      },
      {
        id: "storage",
        title: storageOk ? "First-party storage works" : "Some first-party storage is blocked",
        summary: storageOk ? "A test cookie and a localStorage value were written and deleted." : "At least one storage mechanism refused a test write.",
        status: storageOk ? "pass" : "limited",
        source: "Storage probes",
        confidence: "High",
        href: "/tools/cookies-test",
      },
      ...buildDiagnosticFindings({
        globalPrivacyControl: scan.privacy.globalPrivacyControl,
        doNotTrack: scan.privacy.doNotTrack,
        webrtc: scan.webrtc,
        canvasSupported: scan.canvas.supported,
        audioSupported: scan.audio.supported,
        detectedFontCount: scan.fonts.detectedFonts.length,
        mediaLabelsVisible: scan.media.labelsVisible,
      }),
    ] satisfies DiagnosticFinding[];
  }, [scan]);

  const copy = async () => {
    if (!scan) return;
    try {
      await navigator.clipboard.writeText(reportText(scan, findings));
      setMessage("Report copied to the clipboard.");
    } catch {
      setMessage("This browser did not allow copying to the clipboard.");
    }
  };

  const download = () => {
    if (!scan) return;
    const payload = JSON.stringify({ report: scan, findings, note: "Values are what this browser reported in this session. They can be rounded, frozen or spoofed." }, null, 2);
    const url = URL.createObjectURL(new Blob([payload], { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `browserprobe-report-${scan.generatedAt.slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage("JSON report downloaded.");
  };

  if (!scan) {
    return (
      <div className={styles.launcher}>
        <button type="button" className={styles.primary} onClick={start} disabled={running}>
          {running ? "Checking your browser…" : "Run browser check"}
        </button>
        <p className={styles.launcherNote}>
          Takes about five seconds. Everything runs in this tab. Two checks leave it: one request to this site&apos;s server to read
          your IP address, and STUN requests to Cloudflare for the WebRTC test. Nothing is saved.
        </p>
        {message && <p className={styles.message} role="status">{message}</p>}
      </div>
    );
  }

  const rtcComparison = compareWebRtcWithIp(scan.webrtc, scan.ip);

  return (
    <div className={styles.report} aria-live="polite">
      <div className={styles.reportHeader}>
        <h2 className={styles.reportTitle}>Your browser report</h2>
        <div className={styles.actions}>
          <button type="button" onClick={start} disabled={running}>{running ? "Running…" : "Run again"}</button>
          <button type="button" onClick={copy}>Copy summary</button>
          <button type="button" onClick={download}>Download JSON</button>
          <button type="button" onClick={() => window.print()}>Print</button>
        </div>
      </div>
      {message && <p className={styles.message} role="status">{message}</p>}

      <ol className={styles.findings} aria-label="Findings">
        {findings.map((finding) => (
          <li key={finding.id} className={styles.finding}>
            <span className={`${styles.badge} ${styles[finding.status]}`}>{STATUS_LABEL[finding.status]}</span>
            <div>
              <Link href={finding.href} className={styles.findingTitle}>{finding.title}</Link>
              <p className={styles.findingText}>{finding.summary}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className={styles.grid}>
        <section className={styles.card} aria-labelledby="scan-browser">
          <h3 id="scan-browser">Browser</h3>
          <DataRow compact label="Browser" value={`${scan.browser.name} ${scan.browser.version}`} mono={false} />
          <DataRow compact label="Engine" value={`${scan.browser.engine} ${scan.browser.engineVersion}`} mono={false} />
          <DataRow compact label="Platform" value={scan.browser.platform} mono={false} />
          <DataRow compact label="Languages" value={scan.browser.languages} />
          <Link className={styles.more} href="/tools/what-is-my-browser">User-agent details</Link>
        </section>
        <section className={styles.card} aria-labelledby="scan-network">
          <h3 id="scan-network">Network</h3>
          <DataRow compact label="IP address" value={scan.ip.ip ?? "Not determined"} />
          <DataRow compact label="Address family" value={scan.ip.version ? `IPv${scan.ip.version}` : "Unknown"} mono={false} />
          <DataRow compact label="WebRTC" value={rtcComparison.headline} mono={false} />
          <DataRow compact label="Time zone" value={`${scan.timezone.timezone} (${scan.timezone.utcOffset})`} />
          <Link className={styles.more} href="/tools/webrtc-leak-test">WebRTC details</Link>
        </section>
        <section className={styles.card} aria-labelledby="scan-display">
          <h3 id="scan-display">Display and hardware</h3>
          <DataRow compact label="Screen" value={`${scan.screen.screenWidth} × ${scan.screen.screenHeight}`} />
          <DataRow compact label="Viewport" value={`${scan.screen.viewportWidth} × ${scan.screen.viewportHeight}`} />
          <DataRow compact label="Pixel ratio" value={scan.screen.devicePixelRatio} />
          <DataRow compact label="GPU" value={scan.webgl.supported ? scan.webgl.renderer : "WebGL unavailable"} />
          <Link className={styles.more} href="/tools/screen-resolution">Display details</Link>
        </section>
        <section className={styles.card} aria-labelledby="scan-surfaces">
          <h3 id="scan-surfaces">Fingerprinting surfaces</h3>
          <DataRow compact label="Canvas sample" value={scan.canvas.readback === "varies" ? "Changes per read" : scan.canvas.fingerprint} />
          <DataRow compact label="Audio sample" value={scan.audio.renders === "varies" ? "Changes per render" : scan.audio.fingerprint} />
          <DataRow compact label="Fonts detected" value={`${scan.fonts.detectedFonts.length} of ${scan.fonts.totalTested}`} mono={false} />
          <DataRow compact label="Web APIs present" value={`${scan.features.filter((f) => f.supported).length} of ${scan.features.length}`} mono={false} />
          <Link className={styles.more} href="/tools/canvas-fingerprint">Canvas details</Link>
        </section>
      </div>
      <p className={styles.footnote}>
        Values are what this browser reported in this session. Browsers round, freeze or randomize some of them on purpose, so
        the report describes this browser right now, not a verified device or a unique identity.
      </p>
    </div>
  );
}
