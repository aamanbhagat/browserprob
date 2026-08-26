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
  mobile: boolean;
}

export interface ParsedBrowser {
  name: string;
  version: string;
  engine: string;
  engineVersion: string;
  mobile: boolean;
}

export interface BrowserClientHints {
  brands?: Array<{ brand: string; version: string }>;
  mobile?: boolean;
  platform?: string;
}

interface NavigatorWithUAData extends Navigator {
  userAgentData?: BrowserClientHints;
}

const browserMatchers: Array<{
  name: string;
  pattern: RegExp;
}> = [
  { name: "Microsoft Edge", pattern: /(?:EdgiOS|EdgA|Edg)\/([\d.]+)/ },
  { name: "Opera", pattern: /(?:OPiOS|OPR|Opera)\/([\d.]+)/ },
  { name: "Samsung Internet", pattern: /SamsungBrowser\/([\d.]+)/ },
  { name: "Vivaldi", pattern: /Vivaldi\/([\d.]+)/ },
  { name: "Yandex Browser", pattern: /YaBrowser\/([\d.]+)/ },
  { name: "DuckDuckGo", pattern: /DuckDuckGo\/([\d.]+)/ },
  { name: "Firefox Focus", pattern: /Focus\/([\d.]+)/ },
  { name: "Firefox", pattern: /(?:FxiOS|Firefox)\/([\d.]+)/ },
  { name: "Chrome WebView", pattern: /; wv\).*Chrome\/([\d.]+)/ },
  { name: "Chrome", pattern: /(?:CriOS|Chrome)\/([\d.]+)/ },
  { name: "Chromium", pattern: /Chromium\/([\d.]+)/ },
  { name: "Safari", pattern: /Version\/([\d.]+).*Safari\// },
];

export function parseBrowserUserAgent(ua: string): ParsedBrowser {
  let name = "Unknown";
  let version = "Unknown";
  let engine = "Unknown";
  let engineVersion = "Unknown";

  for (const matcher of browserMatchers) {
    const match = ua.match(matcher.pattern);
    if (match) {
      name = matcher.name;
      version = match[1] || "Unknown";
      break;
    }
  }

  const isIOSBrowser = /(?:FxiOS|CriOS|EdgiOS|OPiOS)/.test(ua);
  const isChromiumFamily = /(?:Chrome|Chromium|EdgA|Edg\/|OPR|Opera|SamsungBrowser|Vivaldi|YaBrowser)/.test(ua);

  if (isIOSBrowser || (/AppleWebKit/.test(ua) && !isChromiumFamily)) {
    engine = "WebKit";
    const match = ua.match(/AppleWebKit\/([\d.]+)/);
    engineVersion = match?.[1] || "Unknown";
  } else if (/Firefox|Focus/.test(ua) && /Gecko/.test(ua)) {
    engine = "Gecko";
    const match = ua.match(/rv:([\d.]+)/);
    engineVersion = match?.[1] || version;
  } else if (isChromiumFamily) {
    engine = "Blink";
    const match = ua.match(/(?:Chrome|CriOS|Chromium)\/([\d.]+)/);
    engineVersion = match?.[1] || version;
  }

  return {
    name,
    version,
    engine,
    engineVersion,
    mobile: /Mobi|Android|iPhone|iPad|iPod|Mobile/.test(ua),
  };
}

export function parseBrowserClientHints(data: BrowserClientHints | undefined): Pick<ParsedBrowser, "name" | "version"> | null {
  if (!data?.brands?.length) return null;

  const ignored = /Not.?A.?Brand|Chromium/i;
  const preferred = data.brands.find((item) => !ignored.test(item.brand));
  if (!preferred) return null;

  const normalizedNames: Record<string, string> = {
    "Google Chrome": "Chrome",
    "Microsoft Edge": "Microsoft Edge",
    Opera: "Opera",
  };

  return {
    name: normalizedNames[preferred.brand] || preferred.brand,
    version: preferred.version || "Unknown",
  };
}

export function detectBrowser(): BrowserInfo {
  const ua = navigator.userAgent;
  const uaData = (navigator as NavigatorWithUAData).userAgentData;
  const parsed = parseBrowserUserAgent(ua);
  const hintedBrowser = parseBrowserClientHints(uaData);

  return {
    name: hintedBrowser?.name || parsed.name,
    version: hintedBrowser?.version || parsed.version,
    engine: parsed.engine,
    engineVersion: parsed.engineVersion,
    userAgent: ua,
    platform: uaData?.platform || navigator.platform || "Unknown",
    language: navigator.language || "Unknown",
    languages: navigator.languages?.join(", ") || navigator.language || "Unknown",
    cookiesEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack || "Not set",
    online: navigator.onLine,
    vendor: navigator.vendor || "None",
    mobile: uaData?.mobile ?? parsed.mobile,
  };
}
