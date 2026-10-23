export interface WebFeature {
  name: string;
  supported: boolean;
  /** Why "present" may not mean "usable here". */
  note?: string;
}

// Mirrors the Permissions-Policy header in next.config.ts.
export const SITE_DISABLED_FEATURES = ["geolocation", "payment", "usb", "bluetooth"] as const;
const DISABLED_HERE = "Present, but this site's Permissions-Policy turns it off on these pages.";
const PERMISSION = "Present; using it requires your permission.";
const ISOLATION = "Only available on cross-origin isolated pages (COOP + COEP). This site is not isolated.";

const canvasContext = (type: string): boolean => {
  try {
    return Boolean(document.createElement("canvas").getContext(type));
  } catch {
    return false;
  }
};

export function detectFeatures(): WebFeature[] {
  const features: WebFeature[] = [
    { name: "WebSocket", supported: typeof WebSocket !== "undefined" },
    { name: "Fetch API", supported: typeof fetch !== "undefined" },
    { name: "Service Worker", supported: "serviceWorker" in navigator },
    { name: "Web Workers", supported: typeof Worker !== "undefined" },
    { name: "SharedArrayBuffer", supported: typeof SharedArrayBuffer !== "undefined" },
    { name: "WebAssembly", supported: typeof WebAssembly !== "undefined" },
    { name: "IndexedDB", supported: typeof indexedDB !== "undefined" },
    { name: "Web Crypto API", supported: typeof crypto?.subtle !== "undefined" },
    { name: "Geolocation", supported: "geolocation" in navigator, note: DISABLED_HERE },
    { name: "Notifications", supported: "Notification" in window, note: PERMISSION },
    { name: "Push API", supported: "PushManager" in window, note: PERMISSION },
    { name: "Async Clipboard API", supported: "clipboard" in navigator },
    { name: "Fullscreen API", supported: "fullscreenEnabled" in document },
    { name: "Gamepad API", supported: "getGamepads" in navigator },
    { name: "Vibration API", supported: "vibrate" in navigator },
    { name: "Battery Status API", supported: "getBattery" in navigator },
    { name: "Web Bluetooth", supported: "bluetooth" in navigator, note: DISABLED_HERE },
    { name: "WebUSB", supported: "usb" in navigator, note: DISABLED_HERE },
    { name: "Web Share API", supported: "share" in navigator },
    { name: "Payment Request API", supported: "PaymentRequest" in window, note: DISABLED_HERE },
    { name: "Credential Management", supported: "credentials" in navigator },
    { name: "Intersection Observer", supported: typeof IntersectionObserver !== "undefined" },
    { name: "Resize Observer", supported: typeof ResizeObserver !== "undefined" },
    { name: "Performance Observer", supported: typeof PerformanceObserver !== "undefined" },
    { name: "Web Animations API", supported: typeof Element.prototype.animate === "function" },
    { name: "View Transitions API", supported: "startViewTransition" in document },
    { name: "Screen Wake Lock", supported: "wakeLock" in navigator },
    { name: "File System Access (pickers)", supported: "showOpenFilePicker" in window },
    { name: "WebRTC", supported: typeof RTCPeerConnection !== "undefined" },
    { name: "WebGPU", supported: "gpu" in navigator },
    { name: "Canvas 2D", supported: canvasContext("2d") },
    { name: "WebGL", supported: canvasContext("webgl") },
    { name: "WebGL 2.0", supported: canvasContext("webgl2") },
  ];
  // Notes about permissions and site policy only make sense for features that exist in this browser.
  return features.map((feature) => {
    if (feature.supported) return feature;
    if (feature.name === "SharedArrayBuffer") return { ...feature, note: ISOLATION };
    return { name: feature.name, supported: false };
  });
}
