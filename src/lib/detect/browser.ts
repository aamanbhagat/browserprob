export interface BrowserInfo {
  name: string;
  version: string;
  engine: string;
  engineVersion: string;
  userAgent: string;
  platform: string;
  language: string;
  languages: string;
  cookiesEnabled: boolean;
  doNotTrack: string;
  online: boolean;
  vendor: string;
}

export function detectBrowser(): BrowserInfo {
  const ua = navigator.userAgent;
  let name = "Unknown";
  let version = "Unknown";
  let engine = "Unknown";
  let engineVersion = "Unknown";

  // Detect engine
  if (ua.includes("AppleWebKit")) {
    engine = ua.includes("Chrome") ? "Blink" : "WebKit";
    const match = ua.match(/AppleWebKit\/([\d.]+)/);
    engineVersion = match ? match[1] : "Unknown";
  } else if (ua.includes("Gecko/")) {
    engine = "Gecko";
    const match = ua.match(/rv:([\d.]+)/);
    engineVersion = match ? match[1] : "Unknown";
  }

  // Detect browser
  if (ua.includes("Firefox/")) {
    name = "Firefox";
    const match = ua.match(/Firefox\/([\d.]+)/);
    version = match ? match[1] : "Unknown";
  } else if (ua.includes("Edg/")) {
    name = "Microsoft Edge";
    const match = ua.match(/Edg\/([\d.]+)/);
    version = match ? match[1] : "Unknown";
  } else if (ua.includes("OPR/") || ua.includes("Opera/")) {
    name = "Opera";
    const match = ua.match(/(?:OPR|Opera)\/([\d.]+)/);
    version = match ? match[1] : "Unknown";
  } else if (ua.includes("Chrome/")) {
    name = "Chrome";
    const match = ua.match(/Chrome\/([\d.]+)/);
    version = match ? match[1] : "Unknown";
  } else if (ua.includes("Safari/") && !ua.includes("Chrome")) {
    name = "Safari";
    const match = ua.match(/Version\/([\d.]+)/);
    version = match ? match[1] : "Unknown";
  }

  return {
    name,
    version,
    engine,
    engineVersion,
    userAgent: ua,
    platform: navigator.platform || "Unknown",
    language: navigator.language || "Unknown",
    languages: navigator.languages?.join(", ") || navigator.language || "Unknown",
    cookiesEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack || "Not set",
    online: navigator.onLine,
    vendor: navigator.vendor || "None",
  };
}
