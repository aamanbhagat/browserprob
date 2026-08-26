"use client";

import { useState, useEffect } from "react";
import { detectBrowser } from "@/lib/detect/browser";
import { detectCanvas } from "@/lib/detect/canvas";
import { detectPrivacy, detectWebRTCLeak } from "@/lib/detect/privacy";
import { detectHardware } from "@/lib/detect/hardware";
import Link from "next/link";
import styles from "./BlogSidebarWidget.module.css";

interface BlogSidebarWidgetProps {
  slug: string;
}

interface DiagnosticFields {
  browser?: string;
  os?: string;
  canvasHash?: string;
  timezone?: string;
  supported?: boolean;
  leakedCount?: number;
  ips?: string[];
  rtcStatus?: string;
  rtcSummary?: string;
  hash?: string;
  dataUrl?: string;
  dnt?: string;
  gpc?: string;
  cores?: number;
  ram?: string;
  gpu?: string;
}

export default function BlogSidebarWidget({ slug }: BlogSidebarWidgetProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DiagnosticFields | null>(null);

  useEffect(() => {
    const runDiagnostics = async () => {
      setLoading(true);
      try {
        if (slug === "what-is-browser-fingerprinting") {
          const b = detectBrowser();
          const c = detectCanvas();
          setData({
            browser: `${b.name} ${b.version}`,
            os: b.platform,
            canvasHash: c.fingerprint.substring(0, 16) + "...",
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          });
        } else if (slug === "webrtc-leak-prevention") {
          const rtc = await detectWebRTCLeak();
          setData({
            supported: rtc.supported,
            leakedCount: rtc.publicIPs.length + rtc.privateIPs.length,
            ips: [...rtc.publicIPs, ...rtc.privateIPs],
            rtcStatus: rtc.status,
            rtcSummary: rtc.summary,
          });
        } else if (slug === "canvas-fingerprinting-explained") {
          const c = detectCanvas();
          setData({
            supported: c.supported,
            hash: c.fingerprint,
            dataUrl: c.dataUrl,
          });
        } else if (slug === "do-not-track-vs-gpc") {
          const p = detectPrivacy();
          setData({
            dnt: p.doNotTrack,
            gpc: p.globalPrivacyControl,
          });
        } else if (slug === "browser-data-leaks") {
          const h = await detectHardware();
          setData({
            cores: h.cpuCores,
            ram: h.deviceMemory,
            gpu: h.gpu,
          });
        }
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    runDiagnostics();
  }, [slug]);

  if (loading) {
    return (
      <div className={styles.widgetCard}>
        <h3 className={styles.widgetTitle}>Live Privacy Probe</h3>
        <div className={styles.loaderWrap}>
          <div className={styles.spinner} />
          <p className={styles.loaderText}>Scanning local leaks...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className={styles.widgetCard}>
      <h3 className={styles.widgetTitle}>
        <span className={styles.pulseDot} /> Live Diagnostic
      </h3>

      {slug === "what-is-browser-fingerprinting" && (
        <div className={styles.widgetContent}>
          <p className={styles.widgetIntro}>Your device signature:</p>
          <div className={styles.dataRow}>
            <span className={styles.label}>Browser</span>
            <span className={styles.value}>{data.browser ?? "Unknown"}</span>
          </div>
          <div className={styles.dataRow}>
            <span className={styles.label}>OS / Platform</span>
            <span className={styles.value}>{data.os ?? "Unknown"}</span>
          </div>
          <div className={styles.dataRow}>
            <span className={styles.label}>Timezone</span>
            <span className={styles.value}>{data.timezone ?? "Unknown"}</span>
          </div>
          <div className={styles.dataRow}>
            <span className={styles.label}>Canvas Hash</span>
            <span className={`${styles.value} ${styles.mono}`}>{data.canvasHash ?? "Unknown"}</span>
          </div>
          <Link href="/tools/canvas-fingerprint" className={styles.actionBtn}>
            Test Canvas Fingerprint →
          </Link>
        </div>
      )}

      {slug === "webrtc-leak-prevention" && (
        <div className={styles.widgetContent}>
          <p className={styles.widgetIntro}>WebRTC address check:</p>
          <div className={styles.dataRow}>
            <span className={styles.label}>Supported</span>
            <span className={styles.value}>{data.supported ? "Yes" : "No"}</span>
          </div>
          <div className={styles.dataRow}>
            <span className={styles.label}>Status</span>
            <span className={`${styles.value} ${data.rtcStatus === "local-address-visible" ? styles.alert : styles.success}`}>
              {data.rtcStatus === "local-address-visible" ? "Review" : data.rtcStatus === "public-address-visible" ? "Compare IPs" : "No numeric local IP"}
            </span>
          </div>
          <p className={styles.widgetIntro}>{data.rtcSummary}</p>
          {(data.leakedCount ?? 0) > 0 && (
            <div className={styles.leaksList}>
              <p className={styles.leaksTitle}>Observed addresses:</p>
              {(data.ips ?? []).map((ip: string) => (
                <div key={ip} className={styles.leakIp}>{ip}</div>
              ))}
            </div>
          )}
          <Link href="/tools/webrtc-leak-test" className={styles.actionBtn}>
            Run Full WebRTC Leak Test →
          </Link>
        </div>
      )}

      {slug === "canvas-fingerprinting-explained" && (
        <div className={styles.widgetContent}>
          <p className={styles.widgetIntro}>Your Canvas render hash:</p>
          {data.dataUrl && (
            <div className={styles.canvasPreview}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.dataUrl} alt="Canvas render" />
            </div>
          )}
          <div className={styles.dataRow}>
            <span className={styles.label}>Canvas Hash</span>
            <span className={`${styles.value} ${styles.mono}`}>{(data.hash ?? "").substring(0, 14)}...</span>
          </div>
          <Link href="/tools/canvas-fingerprint" className={styles.actionBtn}>
            Inspect Pixel Render →
          </Link>
        </div>
      )}

      {slug === "do-not-track-vs-gpc" && (
        <div className={styles.widgetContent}>
          <p className={styles.widgetIntro}>Opt-Out Signal Status:</p>
          <div className={styles.dataRow}>
            <span className={styles.label}>Do Not Track</span>
            <span className={`${styles.value} ${data.dnt === "Enabled" ? styles.success : styles.muted}`}>
              {data.dnt ?? "Not Configured"}
            </span>
          </div>
          <div className={styles.dataRow}>
            <span className={styles.label}>Global Privacy Control</span>
            <span className={`${styles.value} ${data.gpc === "Enabled" ? styles.success : styles.alert}`}>
              {data.gpc ?? "Disabled"}
            </span>
          </div>
          <Link href="/tools/do-not-track" className={styles.actionBtn}>
            Test Privacy Headers →
          </Link>
        </div>
      )}

      {slug === "browser-data-leaks" && (
        <div className={styles.widgetContent}>
          <p className={styles.widgetIntro}>Hardware details exposed:</p>
          <div className={styles.dataRow}>
            <span className={styles.label}>CPU Cores</span>
            <span className={styles.value}>
              {data.cores !== undefined ? `${data.cores} Cores` : "Unknown"}
            </span>
          </div>
          <div className={styles.dataRow}>
            <span className={styles.label}>Device Memory</span>
            <span className={styles.value}>{data.ram ?? "Unknown"}</span>
          </div>
          <div className={styles.dataRow} style={{ flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
            <span className={styles.label}>GPU Model</span>
            <span className={`${styles.value} ${styles.longValue}`}>{data.gpu ?? "Unknown"}</span>
          </div>
          <Link href="/tools/hardware-info" className={styles.actionBtn}>
            Run Hardware Audit →
          </Link>
        </div>
      )}
    </div>
  );
}
