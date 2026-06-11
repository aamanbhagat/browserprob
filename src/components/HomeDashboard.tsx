"use client";

import { useState, useEffect } from "react";
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
  timezone: Record<string, string>;
  js: Record<string, boolean>;
  cookies: Record<string, boolean>;
  plugins: { plugins: string[]; mimeTypes: number; pdfViewer: boolean };
  media: { supported: boolean; audioin: number; audioout: number; videoin: number; total: number };
  features: { name: string; supported: boolean }[];
}

export default function HomeDashboard() {
  const [data, setData] = useState<AllData | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    async function runAllProbes() {
      setProgress(5);

      // Sync probes
      const browser = detectBrowser();
      setProgress(10);
      const screen = detectScreen();
      setProgress(15);
      const network = detectNetwork();
      setProgress(20);
      const canvas = detectCanvas();
      setProgress(30);
      const webgl = detectWebGL();
      setProgress(40);
      const fonts = detectFonts();
      setProgress(50);
      const privacy = detectPrivacy();
      setProgress(55);

      // Timezone
      const tz = Intl.DateTimeFormat().resolvedOptions();
      const now = new Date();
      const offset = now.getTimezoneOffset();
      const offsetHours = Math.abs(Math.floor(offset / 60));
      const offsetMins = Math.abs(offset % 60);
      const sign = offset <= 0 ? "+" : "-";
      const timezone: Record<string, string> = {
        timezone: tz.timeZone || "Unknown",
        locale: tz.locale || navigator.language,
        utcOffset: `UTC${sign}${String(offsetHours).padStart(2, "0")}:${String(offsetMins).padStart(2, "0")}`,
        language: navigator.language,
        languages: navigator.languages?.join(", ") || navigator.language,
        localTime: now.toLocaleString(),
      };
      setProgress(60);

      // JS features
      const js: Record<string, boolean> = {
        webWorkers: typeof Worker !== "undefined",
        serviceWorkers: "serviceWorker" in navigator,
        webAssembly: typeof WebAssembly !== "undefined",
        fetch: typeof fetch !== "undefined",
        promises: typeof Promise !== "undefined",
        bigInt: typeof BigInt !== "undefined",
      };

      // Cookies/storage
      let ls = false;
      try { localStorage.setItem("_bp", "1"); localStorage.removeItem("_bp"); ls = true; } catch { /* */ }
      let ss = false;
      try { sessionStorage.setItem("_bp", "1"); sessionStorage.removeItem("_bp"); ss = true; } catch { /* */ }
      const cookies: Record<string, boolean> = {
        cookiesEnabled: navigator.cookieEnabled,
        localStorage: ls,
        sessionStorage: ss,
        indexedDB: typeof indexedDB !== "undefined",
      };

      // Plugins
      const pluginNames: string[] = [];
      for (let i = 0; i < navigator.plugins.length; i++) pluginNames.push(navigator.plugins[i].name);
      const plugins = {
        plugins: pluginNames,
        mimeTypes: navigator.mimeTypes.length,
        pdfViewer: navigator.pdfViewerEnabled ?? pluginNames.some(p => p.toLowerCase().includes("pdf")),
      };
      setProgress(65);

      // Media devices
      let media = { supported: false, audioin: 0, audioout: 0, videoin: 0, total: 0 };
      try {
        if (navigator.mediaDevices?.enumerateDevices) {
          const devices = await navigator.mediaDevices.enumerateDevices();
          media = {
            supported: true,
            audioin: devices.filter(d => d.kind === "audioinput").length,
            audioout: devices.filter(d => d.kind === "audiooutput").length,
            videoin: devices.filter(d => d.kind === "videoinput").length,
            total: devices.length,
          };
        }
      } catch { /* */ }
      setProgress(70);

      // Browser features
      const features = [
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
      setProgress(75);

      // Async probes — each wrapped with a timeout so nothing can hang
      const withTimeout = <T,>(promise: Promise<T>, fallback: T, ms = 4000): Promise<T> =>
        Promise.race([promise, new Promise<T>((r) => setTimeout(() => r(fallback), ms))]);

      const audioFallback: AudioInfo = { supported: false, fingerprint: "N/A", sampleRate: 0, channelCount: 0, state: "timeout" };
      const hwFallback: HardwareInfo = { cpuCores: navigator.hardwareConcurrency || 0, deviceMemory: "N/A", maxTouchPoints: 0, platform: navigator.platform, gpu: "N/A", batteryStatus: "N/A", batteryLevel: "N/A", batteryCharging: "N/A" };
      const rtcFallback: WebRTCLeak = { localIPs: [], supported: false };
      const ipFallback: IPInfo = { ip: "Unable to detect", ipv4: "Not detected", ipv6: "Not detected" };

      const [audio, hardware, webrtc, ipRes] = await Promise.all([
        withTimeout(detectAudio(), audioFallback),
        withTimeout(detectHardware(), hwFallback),
        withTimeout(detectWebRTCLeak(), rtcFallback),
        withTimeout(detectIP(), ipFallback),
      ]);
      setProgress(100);

      setData({
        browser, screen, network, canvas, webgl, audio, fonts,
        hardware, privacy, webrtc, ip: ipRes, timezone, js, cookies,
        plugins, media, features,
      });
    }

    runAllProbes();
  }, []);

  if (!data) {
    return (
      <div className={styles.loadingWrap}>
        <ProbeAnimation />
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
        <p className={styles.progressText}>Running {progress < 100 ? "probes" : "complete"}... {progress}%</p>
      </div>
    );
  }

  const featuresSupported = data.features.filter(f => f.supported).length;

  return (
    <div className={styles.dashboard}>
      {/* ===== Browser & Identity ===== */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>🌐</span> Browser & Identity
        </h2>
        <div className={styles.cardGrid}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Browser</h3>
            <DataRow label="Browser" value={data.browser.name} />
            <DataRow label="Version" value={data.browser.version} />
            <DataRow label="Engine" value={data.browser.engine} />
            <DataRow label="Engine Version" value={data.browser.engineVersion} />
            <DataRow label="Platform" value={data.browser.platform} />
            <DataRow label="Vendor" value={data.browser.vendor} />
            <DataRow label="Online" value={data.browser.online} />
          </div>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>IP & Network</h3>
            <DataRow label="Detected IP" value={data.ip.ip} />
            <DataRow label="Public IPv4" value={data.ip.ipv4} />
            <DataRow label="Public IPv6" value={data.ip.ipv6} />
            <DataRow label="Connection" value={data.network.effectiveType} />
            <DataRow label="Downlink" value={data.network.downlink} />
            <DataRow label="RTT" value={data.network.rtt} />
            <DataRow label="Data Saver" value={data.network.saveData} mono={false} />
          </div>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Timezone & Locale</h3>
            <DataRow label="Timezone" value={data.timezone.timezone} />
            <DataRow label="UTC Offset" value={data.timezone.utcOffset} />
            <DataRow label="Locale" value={data.timezone.locale} />
            <DataRow label="Language" value={data.timezone.language} />
            <DataRow label="All Languages" value={data.timezone.languages} />
            <DataRow label="Local Time" value={data.timezone.localTime} />
          </div>
        </div>
        <div className={styles.uaCard}>
          <span className={styles.uaLabel}>User Agent</span>
          <span className={styles.uaValue}>{data.browser.userAgent}</span>
        </div>
      </section>

      {/* ===== Privacy & Fingerprinting ===== */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>🔒</span> Privacy & Fingerprinting
        </h2>
        <div className={styles.cardGrid}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Privacy Settings</h3>
            <DataRow label="Do Not Track" value={data.privacy.doNotTrack} mono={false} />
            <DataRow label="Global Privacy Control" value={data.privacy.globalPrivacyControl} mono={false} />
            <DataRow label="Cookies Enabled" value={data.privacy.cookiesEnabled} />
          </div>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>WebRTC Leak</h3>
            <DataRow label="WebRTC Supported" value={data.webrtc.supported} />
            <DataRow label="IPs Leaked" value={data.webrtc.localIPs.length > 0 ? data.webrtc.localIPs.join(", ") : "No leak ✓"} />
            <DataRow
              label="Status"
              value={data.webrtc.localIPs.length > 0 ? "⚠️ Leak detected" : "✅ Secure"}
              mono={false}
            />
          </div>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Canvas Fingerprint</h3>
            <DataRow label="Supported" value={data.canvas.supported} />
            <DataRow label="Hash" value={data.canvas.fingerprint} />
            {data.canvas.dataUrl && (
              <div className={styles.canvasPreview}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={data.canvas.dataUrl} alt="Canvas fingerprint" />
              </div>
            )}
          </div>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Audio Fingerprint</h3>
            <DataRow label="Supported" value={data.audio.supported} />
            <DataRow label="Hash" value={data.audio.fingerprint} />
            <DataRow label="Sample Rate" value={data.audio.sampleRate > 0 ? `${data.audio.sampleRate} Hz` : "N/A"} />
            <DataRow label="Max Channels" value={data.audio.channelCount > 0 ? data.audio.channelCount : null} />
          </div>
        </div>
      </section>

      {/* ===== Hardware & Display ===== */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>🖥️</span> Hardware & Display
        </h2>
        <div className={styles.cardGrid}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Screen</h3>
            <DataRow label="Resolution" value={`${data.screen.screenWidth} × ${data.screen.screenHeight}`} />
            <DataRow label="Viewport" value={`${data.screen.viewportWidth} × ${data.screen.viewportHeight}`} />
            <DataRow label="Pixel Ratio" value={data.screen.devicePixelRatio} />
            <DataRow label="Color Depth" value={`${data.screen.colorDepth}-bit`} />
            <DataRow label="Orientation" value={data.screen.orientation} />
            <DataRow label="Touch" value={data.screen.touchSupport} />
          </div>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Hardware</h3>
            <DataRow label="CPU Cores" value={data.hardware.cpuCores > 0 ? data.hardware.cpuCores : null} />
            <DataRow label="Device Memory" value={data.hardware.deviceMemory} />
            <DataRow label="GPU" value={data.hardware.gpu} />
            <DataRow label="Battery Level" value={data.hardware.batteryLevel} />
            <DataRow label="Charging" value={data.hardware.batteryCharging} mono={false} />
          </div>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>WebGL / GPU</h3>
            <DataRow label="WebGL" value={data.webgl.supported} />
            <DataRow label="WebGL 2.0" value={data.webgl.webgl2} />
            <DataRow label="Renderer" value={data.webgl.renderer} />
            <DataRow label="Vendor" value={data.webgl.vendor} />
            <DataRow label="Max Texture" value={data.webgl.maxTextureSize > 0 ? `${data.webgl.maxTextureSize}px` : "N/A"} />
            <DataRow label="Extensions" value={`${data.webgl.extensions.length} available`} />
          </div>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Media Devices</h3>
            <DataRow label="API Supported" value={data.media.supported} />
            <DataRow label="Microphones" value={data.media.audioin} />
            <DataRow label="Speakers" value={data.media.audioout} />
            <DataRow label="Cameras" value={data.media.videoin} />
            <DataRow label="Total Devices" value={data.media.total} />
          </div>
        </div>
      </section>

      {/* ===== Storage & Cookies ===== */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>🍪</span> Storage & Cookies
        </h2>
        <div className={styles.cardGrid}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Storage</h3>
            <DataRow label="Cookies" value={data.cookies.cookiesEnabled} />
            <DataRow label="LocalStorage" value={data.cookies.localStorage} />
            <DataRow label="SessionStorage" value={data.cookies.sessionStorage} />
            <DataRow label="IndexedDB" value={data.cookies.indexedDB} />
          </div>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>JavaScript</h3>
            <DataRow label="Enabled" value={true} />
            <DataRow label="Web Workers" value={data.js.webWorkers} />
            <DataRow label="Service Workers" value={data.js.serviceWorkers} />
            <DataRow label="WebAssembly" value={data.js.webAssembly} />
            <DataRow label="BigInt" value={data.js.bigInt} />
          </div>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Plugins</h3>
            <DataRow label="Plugins Detected" value={data.plugins.plugins.length} />
            <DataRow label="MIME Types" value={data.plugins.mimeTypes} />
            <DataRow label="PDF Viewer" value={data.plugins.pdfViewer} />
            {data.plugins.plugins.slice(0, 5).map((p, i) => (
              <DataRow key={i} label={`Plugin ${i + 1}`} value={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== Fonts ===== */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>🔤</span> Detected Fonts ({data.fonts.detectedFonts.length} / {data.fonts.totalTested})
        </h2>
        <div className={styles.fontGrid}>
          {data.fonts.detectedFonts.map((font) => (
            <span key={font} className={styles.fontTag} style={{ fontFamily: `"${font}", sans-serif` }}>
              {font}
            </span>
          ))}
        </div>
      </section>

      {/* ===== Browser Features ===== */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>✅</span> Browser Features ({featuresSupported} / {data.features.length})
        </h2>
        <div className={styles.featureGrid}>
          {data.features.map((f) => (
            <div key={f.name} className={styles.featureItem}>
              <span className={styles.featureName}>{f.name}</span>
              <span className={f.supported ? styles.featureYes : styles.featureNo}>
                {f.supported ? "✓" : "✗"}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
