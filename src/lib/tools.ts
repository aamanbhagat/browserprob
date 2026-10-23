export type ToolCategory = "identity" | "privacy" | "hardware" | "features";

export interface Tool {
  slug: string;
  /** Card and link name. */
  name: string;
  shortName: string;
  /** Page <title>, before the " | BrowserProbe" suffix. */
  title: string;
  h1: string;
  /** Server-rendered sentence under the H1. */
  lead: string;
  /** One-line card description. */
  description: string;
  metaDescription: string;
  category: ToolCategory;
  /** ISO date the page's method and copy were last reviewed. */
  updated: string;
}

export const tools: Tool[] = [
  {
    slug: "what-is-my-browser",
    name: "What Is My Browser?",
    shortName: "Browser",
    title: "What Is My Browser? Name, Version & User Agent",
    h1: "What is my browser?",
    lead: "The browser name, version, rendering engine and user-agent string your browser reports to every site you visit.",
    description: "Browser name, version, engine and user-agent string.",
    metaDescription: "See the browser name, version, rendering engine and user-agent string your browser reports to websites, and which parts of that string are frozen or reduced.",
    category: "identity",
    updated: "2026-10-23",
  },
  {
    slug: "what-is-my-ip",
    name: "What Is My IP Address?",
    shortName: "IP address",
    title: "What Is My IP Address? IPv4 or IPv6 Check",
    h1: "What is my IP address?",
    lead: "The public IP address this site received your request from, whether it is IPv4 or IPv6, and what kind of address it is.",
    description: "The public address this site sees, and its type.",
    metaDescription: "See the public IP address this site received your request from, whether it is IPv4 or IPv6, and the approximate location our host's IP database gives it.",
    category: "identity",
    updated: "2026-10-23",
  },
  {
    slug: "client-hints",
    name: "User-Agent Client Hints",
    shortName: "Client Hints",
    title: "User-Agent Client Hints Test",
    h1: "User-Agent Client Hints",
    lead: "The brands, platform and detailed device values your browser shares through User-Agent Client Hints, the replacement for the user-agent string.",
    description: "Brands, platform version, architecture and model.",
    metaDescription: "Read the brands, platform and high-entropy values (platform version, architecture, model, full version list) your browser shares through User-Agent Client Hints.",
    category: "identity",
    updated: "2026-10-23",
  },
  {
    slug: "timezone-locale",
    name: "Timezone & Locale",
    shortName: "Timezone",
    title: "Timezone & Locale Check: What Your Browser Reports",
    h1: "Timezone and locale",
    lead: "The time zone, UTC offset, language list and formatting rules your browser hands to every page through the Intl API.",
    description: "Time zone, offset, languages and date formats.",
    metaDescription: "See the time zone, UTC offset, locale, language list and date formats your browser exposes through the Intl API, compared with the time zone of your IP address.",
    category: "identity",
    updated: "2026-10-23",
  },
  {
    slug: "webrtc-leak-test",
    name: "WebRTC Leak Test",
    shortName: "WebRTC",
    title: "WebRTC Leak Test: Compare ICE Addresses With Your IP",
    h1: "WebRTC leak test",
    lead: "Gathers WebRTC connection candidates through a public STUN server and compares the addresses they contain with the IP this site sees.",
    description: "ICE candidates compared with your public IP.",
    metaDescription: "Gather WebRTC ICE candidates through a public STUN server and compare their addresses with the IP this site sees. Explains when a result is a real leak and when it isn't.",
    category: "privacy",
    updated: "2026-10-23",
  },
  {
    slug: "cookies-test",
    name: "Cookies & Storage Test",
    shortName: "Cookies",
    title: "Cookies & Storage Test: Are Cookies Enabled?",
    h1: "Are cookies enabled?",
    lead: "Writes and immediately deletes a test value in each first-party storage mechanism to show which ones this site can actually use.",
    description: "Cookie, Web Storage, IndexedDB and quota checks.",
    metaDescription: "Check whether this site can write a first-party cookie, localStorage, sessionStorage, IndexedDB and Cache Storage, plus your storage quota and persistence status.",
    category: "privacy",
    updated: "2026-10-23",
  },
  {
    slug: "canvas-fingerprint",
    name: "Canvas Fingerprint Test",
    shortName: "Canvas",
    title: "Canvas Fingerprint Test: See Your Canvas Sample ID",
    h1: "Canvas fingerprint test",
    lead: "Draws the same image twice on a hidden canvas, turns each result into a short sample ID, and checks whether your browser alters the pixels.",
    description: "A repeatable ID for one canvas drawing.",
    metaDescription: "Draw a fixed canvas image twice, see its sample ID, and find out whether your browser adds per-read noise. Explains what canvas fingerprinting can and can't show.",
    category: "privacy",
    updated: "2026-10-23",
  },
  {
    slug: "audio-fingerprint",
    name: "Audio Fingerprint Test",
    shortName: "Audio",
    title: "Audio Fingerprint Test (Web Audio API)",
    h1: "Audio fingerprint test",
    lead: "Renders a short, silent Web Audio signal twice and compares the results, without playing anything through your speakers.",
    description: "A repeatable ID for one Web Audio render.",
    metaDescription: "Render a silent Web Audio signal twice and compare the sample IDs to see whether audio processing in your browser is stable or randomized between reads.",
    category: "privacy",
    updated: "2026-10-23",
  },
  {
    slug: "font-detection",
    name: "Font Detection",
    shortName: "Fonts",
    title: "Font Fingerprinting Test: Which Fonts Are Detectable?",
    h1: "Font detection test",
    lead: "Measures text drawn in 40 common font names to estimate which of them a website can tell apart from the browser's fallback fonts.",
    description: "Which of 40 font names a page can detect.",
    metaDescription: "Check which of 40 common font names a website can detect in your browser by measuring rendered text, and learn why the method produces false positives.",
    category: "privacy",
    updated: "2026-10-23",
  },
  {
    slug: "do-not-track",
    name: "Do Not Track & GPC Test",
    shortName: "DNT & GPC",
    title: "Do Not Track & Global Privacy Control Test",
    h1: "Do Not Track and Global Privacy Control",
    lead: "Shows whether your browser exposes a Do Not Track or Global Privacy Control preference to the pages you visit.",
    description: "Do Not Track and Global Privacy Control signals.",
    metaDescription: "See whether your browser sends Do Not Track or Global Privacy Control signals, how browsers handle them today, and where GPC carries legal weight.",
    category: "privacy",
    updated: "2026-10-23",
  },
  {
    slug: "screen-resolution",
    name: "Screen Resolution Test",
    shortName: "Screen",
    title: "Screen Resolution Test: Viewport, DPR and Display",
    h1: "Screen resolution test",
    lead: "Your screen and window sizes, pixel density, color capabilities and display preferences, updated as you resize the window.",
    description: "Screen, viewport, pixel ratio and color support.",
    metaDescription: "Check your screen resolution, available area, viewport, device pixel ratio, color gamut, HDR support and display preferences, updated live as you resize.",
    category: "hardware",
    updated: "2026-10-23",
  },
  {
    slug: "webgl-info",
    name: "WebGL & WebGPU Info",
    shortName: "WebGL / GPU",
    title: "WebGL & WebGPU Info: GPU Renderer and Limits",
    h1: "WebGL and WebGPU information",
    lead: "The graphics renderer and vendor strings, WebGL limits and extensions, and WebGPU adapter details your browser exposes.",
    description: "GPU renderer, WebGL limits and WebGPU adapter.",
    metaDescription: "View the GPU renderer and vendor strings, WebGL 1 and 2 support, limits, extensions and WebGPU adapter info your browser exposes to web pages.",
    category: "hardware",
    updated: "2026-10-23",
  },
  {
    slug: "hardware-info",
    name: "Hardware Information",
    shortName: "Hardware",
    title: "Hardware Info: CPU Cores, Memory and Battery",
    h1: "Hardware information",
    lead: "The processor, memory, graphics, touch and battery details your browser reveals, and the ones it deliberately rounds or hides.",
    description: "CPU cores, rounded memory, GPU and battery.",
    metaDescription: "See the CPU core count, rounded device memory, GPU string, touch points and battery status your browser reveals, and which browsers hide them.",
    category: "hardware",
    updated: "2026-10-23",
  },
  {
    slug: "media-devices",
    name: "Media Devices Detection",
    shortName: "Media devices",
    title: "Camera & Microphone Detection (Media Devices)",
    h1: "Media devices",
    lead: "Which cameras, microphones and speakers a website can count without asking, and the device names it only sees after you grant permission.",
    description: "Cameras, microphones and speakers a page can see.",
    metaDescription: "See which cameras, microphones and speakers a website can count without permission, and optionally reveal device names. Nothing is recorded.",
    category: "hardware",
    updated: "2026-10-23",
  },
  {
    slug: "connection-speed",
    name: "Connection Information",
    shortName: "Connection",
    title: "Connection Information (Not a Speed Test)",
    h1: "Connection information",
    lead: "Your browser's own connection estimates and the timing of this page's load. This is not a bandwidth speed test.",
    description: "Network estimates and page-load timing.",
    metaDescription: "See the Network Information API estimates (Chromium browsers) and how this page loaded: protocol, DNS, connection, TLS and time to first byte. Not a bandwidth test.",
    category: "hardware",
    updated: "2026-10-23",
  },
  {
    slug: "javascript-info",
    name: "Is JavaScript Enabled?",
    shortName: "JavaScript",
    title: "Is JavaScript Enabled? JavaScript Feature Test",
    h1: "Is JavaScript enabled?",
    lead: "Answers whether JavaScript runs in this browser, even when it doesn't, and lists the modern JavaScript built-ins it supports.",
    description: "Whether JavaScript runs, and ES2015–ES2025 support.",
    metaDescription: "See instantly whether JavaScript runs in your browser, and which modern ECMAScript built-ins from ES2015 to ES2025 it supports.",
    category: "features",
    updated: "2026-10-23",
  },
  {
    slug: "browser-features",
    name: "Browser Feature Support",
    shortName: "Features",
    title: "Browser Feature Support Test: Web Platform APIs",
    h1: "Browser feature support",
    lead: "Checks which web platform APIs exist in this browser, and points out the ones that need permission or that this site switches off.",
    description: "Which web platform APIs this browser exposes.",
    metaDescription: "Check which web platform APIs exist in your browser, including WebGPU, View Transitions and WebUSB, and which ones need permission or are disabled on this site.",
    category: "features",
    updated: "2026-10-23",
  },
  {
    slug: "browser-plugins",
    name: "Plugins & PDF Viewer",
    shortName: "Plugins / PDF",
    title: "PDF Viewer & navigator.plugins Check",
    h1: "Browser plugins and PDF viewer",
    lead: "What navigator.plugins and pdfViewerEnabled report in this browser. Modern browsers return a fixed list here, and no page can list your extensions this way.",
    description: "navigator.plugins and built-in PDF viewing.",
    metaDescription: "See what navigator.plugins and pdfViewerEnabled report in your browser and why modern browsers return a fixed PDF list. This page cannot detect extensions.",
    category: "features",
    updated: "2026-10-23",
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getTool(slug: string): Tool {
  const tool = getToolBySlug(slug);
  if (!tool) throw new Error(`Unknown tool: ${slug}`);
  return tool;
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

export const categories: Record<ToolCategory, { name: string; color: string }> = {
  identity: { name: "Identity & network", color: "#2458e8" },
  privacy: { name: "Privacy & fingerprinting", color: "#c84550" },
  hardware: { name: "Hardware & display", color: "#0e7068" },
  features: { name: "Features & support", color: "#a85f00" },
};
