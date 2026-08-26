export interface Tool {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  metaDescription: string;
  icon: string;
  category: "identity" | "privacy" | "hardware" | "features";
  keywords: string[];
}

export const tools: Tool[] = [
  {
    slug: "what-is-my-browser",
    name: "What Is My Browser?",
    shortName: "Browser",
    description: "Detect your browser name, version, rendering engine, and user agent string.",
    metaDescription: "Find out what browser you are using. BrowserProbe detects your browser name, version, rendering engine (Blink, Gecko, WebKit), and full user agent string instantly.",
    icon: "🌐",
    category: "identity",
    keywords: ["what is my browser", "browser detector", "check browser version", "user agent"],
  },
  {
    slug: "what-is-my-ip",
    name: "What Is My IP Address?",
    shortName: "IP Address",
    description: "Discover your public IP address and connection details instantly.",
    metaDescription: "Check your public IP address instantly. BrowserProbe reveals your IPv4/IPv6 address and connection details. Free, fast, and no signup required.",
    icon: "📡",
    category: "identity",
    keywords: ["what is my ip", "my ip address", "check my ip", "ip lookup"],
  },
  {
    slug: "screen-resolution",
    name: "Screen Resolution Test",
    shortName: "Screen",
    description: "Check your screen resolution, viewport size, pixel ratio, and display info.",
    metaDescription: "Test your screen resolution, viewport size, device pixel ratio, and color depth. See exactly how websites see your display. Free online screen test.",
    icon: "🖥️",
    category: "hardware",
    keywords: ["screen resolution test", "what is my screen resolution", "monitor resolution", "viewport size"],
  },
  {
    slug: "javascript-info",
    name: "JavaScript Detection",
    shortName: "JavaScript",
    description: "Check if JavaScript is enabled and which features your browser supports.",
    metaDescription: "Test if JavaScript is enabled in your browser. Check support for ES6+, Web Workers, Service Workers, and modern JS features. Free JavaScript detector.",
    icon: "⚡",
    category: "features",
    keywords: ["is javascript enabled", "javascript test", "javascript detector", "js check"],
  },
  {
    slug: "cookies-test",
    name: "Cookies Test",
    shortName: "Cookies",
    description: "Test if your browser accepts cookies and check cookie storage limits.",
    metaDescription: "Test if cookies are enabled in your browser. Check first-party and third-party cookie support, storage limits, and cookie settings. Free online test.",
    icon: "🍪",
    category: "privacy",
    keywords: ["cookies enabled test", "cookie test", "check browser cookies", "are cookies enabled"],
  },
  {
    slug: "webrtc-leak-test",
    name: "WebRTC Leak Test",
    shortName: "WebRTC",
    description: "Inspect WebRTC ICE addresses and compare them with your public IP.",
    metaDescription: "Inspect the IP addresses visible through WebRTC and compare them with your detected public IP. Includes evidence, limits, and practical guidance.",
    icon: "🔓",
    category: "privacy",
    keywords: ["webrtc leak test", "webrtc ip leak", "check webrtc", "webrtc vpn leak"],
  },
  {
    slug: "canvas-fingerprint",
    name: "Canvas Fingerprint Test",
    shortName: "Canvas",
    description: "Generate a repeatable ID for one canvas rendering sample.",
    metaDescription: "Generate a canvas rendering sample and stable sample ID. Learn what canvas fingerprinting can infer—and why one result cannot prove uniqueness.",
    icon: "🎨",
    category: "privacy",
    keywords: ["canvas fingerprint test", "canvas fingerprinting", "browser canvas test"],
  },
  {
    slug: "webgl-info",
    name: "WebGL Information",
    shortName: "WebGL",
    description: "View WebGL capabilities, GPU renderer, vendor, and extensions.",
    metaDescription: "Check your WebGL support, GPU renderer, vendor string, and available extensions. Test WebGL 1.0 and 2.0 compatibility. Free WebGL information tool.",
    icon: "🎮",
    category: "hardware",
    keywords: ["webgl test", "check webgl support", "webgl information", "gpu renderer"],
  },
  {
    slug: "font-detection",
    name: "Font Detection",
    shortName: "Fonts",
    description: "Estimate which tested font names are distinguishable in your browser.",
    metaDescription: "Estimate which tested font names are distinguishable through browser text metrics. Learn the method's false-positive limits and fingerprinting relevance.",
    icon: "🔤",
    category: "privacy",
    keywords: ["font detection", "installed fonts test", "browser fonts", "font fingerprint"],
  },
  {
    slug: "audio-fingerprint",
    name: "Audio Fingerprint Test",
    shortName: "Audio",
    description: "Generate a repeatable Web Audio rendering sample ID.",
    metaDescription: "Generate a repeatable Web Audio rendering sample ID and learn how audio output may contribute to a broader browser fingerprint.",
    icon: "🔊",
    category: "privacy",
    keywords: ["audio fingerprint test", "audiocontext fingerprint", "audio fingerprinting"],
  },
  {
    slug: "browser-plugins",
    name: "Browser Plugins & PDF Support",
    shortName: "Plugins",
    description: "Inspect the reduced plugins API, MIME types, and PDF viewer support.",
    metaDescription: "Inspect values exposed through the browser's reduced plugins API, MIME type list, and PDF viewer capability. This test cannot list installed extensions.",
    icon: "🧩",
    category: "features",
    keywords: ["browser plugins list", "installed extensions check", "browser extensions detection"],
  },
  {
    slug: "do-not-track",
    name: "Do Not Track Test",
    shortName: "DNT",
    description: "Check if Do Not Track and Global Privacy Control are enabled.",
    metaDescription: "Test if Do Not Track (DNT) and Global Privacy Control (GPC) are enabled in your browser. Learn about their effectiveness and privacy impact. Free test.",
    icon: "🛡️",
    category: "privacy",
    keywords: ["do not track test", "is do not track enabled", "dnt check", "global privacy control"],
  },
  {
    slug: "connection-speed",
    name: "Connection Information",
    shortName: "Connection",
    description: "View your network connection type, speed estimate, and data saver status.",
    metaDescription: "Check your connection type, estimated speed, round-trip time, and data saver mode using the Network Information API. Free connection test.",
    icon: "📶",
    category: "hardware",
    keywords: ["connection speed test", "network information api", "check connection type"],
  },
  {
    slug: "hardware-info",
    name: "Hardware Information",
    shortName: "Hardware",
    description: "Detect CPU cores, device memory, battery status, and GPU details.",
    metaDescription: "Check your device hardware through your browser: CPU cores, device memory, battery status, and GPU information. Free hardware detection tool.",
    icon: "🖲️",
    category: "hardware",
    keywords: ["hardware info browser", "cpu cores browser", "device memory check"],
  },
  {
    slug: "timezone-locale",
    name: "Timezone & Locale",
    shortName: "Timezone",
    description: "Detect your timezone, language preferences, and locale settings.",
    metaDescription: "Check your browser timezone, locale, language preferences, and date formatting. See how timezone data contributes to browser fingerprinting. Free test.",
    icon: "🕐",
    category: "identity",
    keywords: ["what is my timezone", "browser timezone", "locale detection"],
  },
  {
    slug: "media-devices",
    name: "Media Devices Detection",
    shortName: "Media",
    description: "Check available cameras, microphones, and audio output devices.",
    metaDescription: "Detect available media devices (cameras, microphones, speakers) in your browser without accessing them. Free media devices detection tool.",
    icon: "📹",
    category: "hardware",
    keywords: ["camera microphone test", "media devices browser", "webcam check online"],
  },
  {
    slug: "browser-features",
    name: "Browser Features Support",
    shortName: "Features",
    description: "Test support for 30+ modern web APIs and browser features.",
    metaDescription: "Test your browser's support for 30+ modern web APIs including WebSocket, Push Notifications, Clipboard API, and more. Free compatibility checker.",
    icon: "✅",
    category: "features",
    keywords: ["browser features test", "html5 support check", "browser compatibility test"],
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getRelatedTools(currentSlug: string, count = 4): Tool[] {
  const current = getToolBySlug(currentSlug);
  if (!current) return tools.slice(0, count);

  const sameCategory = tools.filter(
    (t) => t.category === current.category && t.slug !== currentSlug
  );
  const others = tools.filter(
    (t) => t.category !== current.category && t.slug !== currentSlug
  );

  return [...sameCategory, ...others].slice(0, count);
}

export const categories = {
  identity: { name: "Identity & network", color: "#2458e8" },
  privacy: { name: "Privacy & fingerprinting", color: "#c84550" },
  hardware: { name: "Hardware & display", color: "#0e7068" },
  features: { name: "Features & support", color: "#a85f00" },
};
