export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: "Privacy" | "Security" | "Identity" | "Tracking";
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "what-is-browser-fingerprinting",
    title: "What Is Browser Fingerprinting? A Technical Deep Dive (2026)",
    excerpt: "Learn how websites combine browser signals into probabilistic identifiers without relying only on cookies or local storage.",
    date: "2026-06-01",
    readTime: "8 min read",
    category: "Tracking",
    content: `Browser fingerprinting is a collection of techniques that combine browser, operating-system, hardware, and network signals to recognize or classify a browser. Unlike a cookie, the resulting identifier can be recomputed from observable properties instead of read from a stored ID.

Fingerprinting is probabilistic: a result may be common, rare, stable, or unstable depending on the population, time window, browser defenses, and signals collected. No single sample proves identity or uniqueness.

## The Shift from Cookies to Fingerprinting

For decades, websites relied on HTTP cookies to track users across sessions. When you visited a site, a unique cookie ID was saved to your storage. When you loaded a new page, your browser sent that cookie back, letting the server know you were the same visitor.

However, as browser privacy settings improved, search engines added tracking protection, and users began routinely clearing their cookies, advertisers needed a tracking method that didn't rely on local storage. 

> **Enter Browser Fingerprinting.** Instead of writing a tracking ID to your disk, websites *read* your device configuration to construct your tracking ID dynamically.

## How a Browser Fingerprint Is Structured

Every time your browser loads a page, it exposes properties needed for content negotiation and web features. A fingerprinting system may combine those values directly or hash them into a shorter identifier. Hashing makes data compact; it does not make the observations unique or prove who produced them.

Here are the primary components that feed into this signature:

### 1. User Agent and HTTP Headers
The \`User-Agent\` header can contain browser and platform details, although modern browsers may reduce or freeze parts of it. Header values and ordering can add signals, but many visitors share the same pattern.

### 2. Screen and Display Configurations
Websites can read screen and viewport dimensions, color depth, device pixel ratio (DPR), and orientation. Window size and scaling may narrow a population, while browser protections can round or standardize values.

### 3. Rendering Engine & Hardware Acceleration (Canvas & WebGL)
By drawing hidden shapes and text on an HTML5 \`<canvas>\` or WebGL canvas, scripts analyze how your graphics card (GPU) renders imagery. Subtle differences in anti-aliasing, rasterization algorithms, and graphics card driver versions cause devices to render pixels slightly differently.

### 4. Font Enumeration
Fingerprinters can test font availability by comparing text dimensions. Custom fonts may make a result less common, while fallback substitution and browser restrictions can make the test incomplete.

### 5. Timezones, Locale & Locales
The JavaScript \`Intl\` API can expose a configured timezone, locale, language preferences, calendar, and numbering system. A timezone/IP mismatch can be one risk signal, but it does not by itself prove location, VPN use, or fraud.

## Hashing and Entropy: The Math Behind the Track

In information theory, **entropy** measures uncertainty in a distribution, expressed in bits. Estimating fingerprint entropy therefore requires a defined population and representative measurements; this page cannot derive it from one visitor.

\`\`\`
Entropy (H) = - Σ (P(x) * log2(P(x)))
\`\`\`

Where \`P(x)\` is the probability of a configuration in the measured population. A configuration observed once per million samples has about 20 bits of self-information in that dataset. It does not follow that the browser is isolated from every device on the internet.

## Actionable Mitigation Strategies

Traditional adblockers and incognito mode do not stop browser fingerprinting because your underlying hardware remains identical. To resist fingerprinting, you must reduce your entropy:

1. **Use a browser designed for an anonymity set**: Tor Browser standardizes and restricts many surfaces so users resemble one another. Differences can still exist, and behavior or account activity can still identify a person.
2. **Use built-in fingerprinting defenses**: Brave applies site- and session-scoped randomization called farbling to selected APIs. It raises the cost of stable cross-site measurement; it does not make linking sessions impossible. See [Brave's explanation of farbling](https://brave.com/privacy-updates/4-fingerprinting-defenses-2.0/).
3. **Use Firefox ResistFingerprinting (RFP)**: Entering \`about:config\` and enabling \`privacy.resistFingerprinting\` configures Firefox to act similarly to Tor Browser, capping display sizes, spoofing timezones, and restricting font checks.

Use [BrowserProbe's homepage](/) to inspect which signals this browser exposes. The report deliberately does not claim to measure global uniqueness from a single visit.`,
  },
  {
    slug: "webrtc-leak-prevention",
    title: "How to Test and Prevent WebRTC IP Leaks: The Complete Guide",
    excerpt: "Learn how WebRTC ICE candidates expose network addresses, how to compare them with a VPN endpoint, and when a result needs review.",
    date: "2026-05-20",
    readTime: "6 min read",
    category: "Security",
    content: `WebRTC (Web Real-Time Communication) lets browsers negotiate real-time audio, video, and data connections. During connection setup, ICE candidates may contain host, server-reflexive, or relay addresses. Those addresses can reveal more network information than a visitor expects.

Whether this reveals an address outside a VPN depends on the browser, operating system, VPN routing, and ICE policy. Seeing a public candidate is evidence to compare—not automatic proof of a VPN leak.

## How ICE Discovers Network Paths

To understand the exposure, look at how browsers establish peer-to-peer connections. Because peers may sit behind NAT and firewalls, browsers use **Interactive Connectivity Establishment (ICE)** to gather and test possible paths.

ICE candidates are generated by querying external **STUN** (Session Traversal Utilities for NAT) servers. 

\`\`\`
[Browser] --- (Queries STUN Server) ---> [Google STUN Server]
[Browser] <--- (Returns Public IP) <--- [Google STUN Server]
\`\`\`

During this query, the browser sends traffic to the STUN server and may receive a server-reflexive candidate representing the public endpoint observed for that route.

Correctly configured VPNs normally route this traffic through the tunnel. A routing or browser-policy problem can expose a different public endpoint. Modern browsers may replace local numeric host candidates with mDNS names.

## The WebRTC IP Extraction Script

Websites do not need special permissions to read your WebRTC ICE candidates. A simple script can create an empty PeerConnection, trigger candidate gathering, and parse the resulting IP addresses:

\`\`\`javascript
const pc = new RTCPeerConnection({
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
});

pc.createDataChannel("");
pc.createOffer().then(offer => pc.setLocalDescription(offer));

pc.onicecandidate = (event) => {
  if (event.candidate) {
    const candidate = event.candidate.candidate;
    // Regex extracts IPv4 and IPv6 addresses from the candidate string
    const match = candidate.match(/([0-9a-f.:]+)/i);
    if (match) console.log("Detected IP:", match[1]);
  }
};
\`\`\`

A page can trigger ICE gathering without camera or microphone permission. Candidate timing varies, and an IP address provides approximate network attribution rather than a person's precise location.

## How to Test for WebRTC Leaks

To verify if your privacy setup is leaking your network configuration:

1. Enable your VPN or proxy.
2. Visit [BrowserProbe's WebRTC Leak Test](/tools/webrtc-leak-test).
3. Compare any public ICE candidate with the public IP shown by the IP check and the endpoint expected from your VPN provider.
4. Treat a different home-ISP address as strong evidence to investigate. A private address (such as \`10.x.x.x\` or \`192.168.x.x\`) reveals local network topology but is not a globally routable identity.

## Step-by-Step Mitigation Guide

To reduce exposure, prefer a VPN that explicitly handles WebRTC and verify its behavior after browser or VPN updates. Blocking non-proxied UDP or requiring relay candidates can reduce address exposure but may break calls or increase latency.

### 1. Mozilla Firefox (Native Control)
Firefox is the only browser that allows you to disable WebRTC entirely without third-party extensions:
- Type \`about:config\` in the Firefox address bar and accept the risk warning.
- Search for the flag: \`media.peerconnection.enabled\`.
- Double-click the flag to change its value from \`true\` to \`false\`.

*Note: This will prevent WebRTC-based video calling services from running in your browser.*

### 2. Google Chrome & Microsoft Edge
Chromium browser controls and extension policies change over time. Prefer the current documentation from your browser and VPN vendor, and be cautious with extensions that can read browsing data.

### 3. Brave Browser
Brave and managed Chromium environments may expose WebRTC IP-handling policies. Use the least permissive setting compatible with the calling services you need, then rerun the comparison test.

After changing a routing policy, test both address exposure and the calling services you rely on. A clean result describes that test run; it is not a permanent guarantee.`,
  },
  {
    slug: "canvas-fingerprinting-explained",
    title: "Canvas Fingerprinting: Renders, Hashes, and Silent Tracking",
    excerpt: "Explore how canvas rendering samples are produced, why results can differ, and how sites may combine them with other tracking signals.",
    date: "2026-05-10",
    readTime: "7 min read",
    category: "Tracking",
    content: `HTML5 Canvas fingerprinting draws a known graphic, reads the rendered pixels, and summarizes the output. The operation can run in the background and contribute a rendering signal without writing a cookie.

This article explains the mechanics, why results can vary across configurations, and the tradeoffs of common defenses.

## The Technical Execution of a Canvas Probe

Canvas fingerprinting works by utilizing your browser's HTML5 Canvas element — a tool designed to draw shapes and graphics dynamically via JavaScript. 

To generate a fingerprint, the script runs the following tasks:

1. **Creates a Hidden Canvas**: The script creates a \`<canvas>\` DOM element, keeping it hidden from the viewport so you don't see it rendering.
2. **Applies Complex Graphics**: It draws a predetermined test pattern containing a specific string of text (often including emojis, special characters, and multiple font sizes) overlaying gradients, drop shadows, and blending modes.
3. **Converts Pixels to Data**: The script reads the raw pixel data from the canvas context using \`canvas.toDataURL("image/png")\`, which converts the drawn pixels into a base64-encoded PNG data string.
4. **Hashes the Output**: The base64 string is hashed using a non-cryptographic algorithm like MurmurHash3 to produce a short fingerprint key (e.g., \`f3e4a5d6\`).

\`\`\`javascript
// A simple canvas fingerprint generator
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
ctx.textBaseline = "top";
ctx.font = "14px 'Arial'";
ctx.fillStyle = "#f60";
ctx.fillRect(125, 1, 62, 20);
ctx.fillStyle = "#069";
ctx.fillText("BrowserProbe, testing 🕵️‍♂️!", 2, 15);
const hash = murmurhash3(canvas.toDataURL());
\`\`\`

## Why Can Canvas Results Differ?

You might expect that drawing the same text with the same font would produce the identical image on every computer. In reality, the output pixel array is highly dependent on your system's hardware and software stack:

- **Graphics Processing Unit (GPU)**: Different GPUs (Intel, NVIDIA, AMD, Apple M-Series) use different rasterization and anti-aliasing engines, leading to microscopic differences in sub-pixel colors.
- **Font Rendering Engines**: Operating systems handle font smoothing (ClearType on Windows vs. Quartz on macOS) differently, producing slight variations in text curves and outline geometries.
- **Drivers and Browser Versions**: GPU drivers and the browser's graphics rendering pipeline (including ANGLE and platform graphics libraries) can affect rendering details.

Many devices still produce the same canvas result, while some configurations differ. Population data is required to estimate how identifying a given result is; the hash alone contains no proof of uniqueness.

## How to Block Canvas Trackers

Defending your system against canvas fingerprinting requires either blocking the API altogether or altering its output.

### 1. Blanking/Blocking
One defense is to gate or standardize canvas reads. Privacy-focused browsers may return modified output or require user interaction for some extraction paths.

*The tradeoff*: Blocking can break legitimate graphics features, and an uncommon blocking behavior may itself become another observable signal.

### 2. Canvas Randomization (Farbling)
Another defense is scoped randomization. Browsers such as Brave can alter selected canvas outputs using values scoped by site and session.

This can make a stable cross-site identifier harder to obtain without forcing every same-page read to change. It increases tracking cost but does not guarantee anonymity.

Use [BrowserProbe's Canvas Fingerprint Tool](/tools/canvas-fingerprint) to view the test graphic and its repeatable sample ID. Matching or differing IDs are evidence about this rendering test—not proof of identity.`,
  },
  {
    slug: "do-not-track-vs-gpc",
    title: "Is Do Not Track Dead? Understanding GPC and Modern Privacy Laws",
    excerpt: "Do Not Track lacked an enforcement model. Learn how Global Privacy Control can express legally recognized opt-out requests in covered jurisdictions.",
    date: "2026-04-28",
    readTime: "5 min read",
    category: "Privacy",
    content: `In 2009, privacy researchers proposed **Do Not Track (DNT)** — a simple HTTP request header that users could toggle in browser settings. The concept was straightforward: if a browser sent the header \`DNT: 1\`, websites were requested to disable tracking cookies, behavioral profiles, and data sharing.

While DNT was adopted by major browsers, it never gained consistent site compliance. Global Privacy Control (GPC) is a newer opt-out preference signal that is recognized by some privacy laws and regulators.

## Why Do Not Track Failed

The fatal flaw of Do Not Track was its voluntary nature. DNT was a polite request, not a legal mandate. 

When the header was finalized, major ad tech companies and data brokers openly ignored it. There was no regulatory penalty for tracking users who had DNT enabled. In 2012, Internet Explorer enabled DNT by default, prompting the advertising lobby to argue that the signal did not represent active user choice, rendering it invalid.

Standardization groups reached a deadlock, and the W3C tracking protection working group officially disbanded in 2019. 

DNT can also add one observable bit to a browser profile when its value differs across users. Whether that materially improves recognition depends on the rest of the dataset.

## The Rise of Global Privacy Control (GPC)

Global Privacy Control (GPC) was created by a coalition of privacy organizations, browser vendors, and legal experts to succeed DNT. 

GPC works under the hood via two methods:
1. **An HTTP Header**: Your browser sends \`Sec-GPC: 1\` with every web request.
2. **A JavaScript Property**: The browser exposes the property \`navigator.globalPrivacyControl\` set to \`true\`.

\`\`\`
[Browser (Sec-GPC: 1)] ---> [Website Server] ---> Read GPC, Opt-Out User
\`\`\`

The crucial difference: **GPC can carry legal effect in covered jurisdictions.**

For example, California says covered businesses must honor a user-enabled GPC signal as a valid request to stop the sale or sharing of personal information. Requirements and scope vary by jurisdiction and business; GPC is not a universal technical block. See the [California Attorney General's GPC guidance](https://oag.ca.gov/privacy/ccpa).

California's 2022 Sephora settlement included allegations that the company failed to process GPC opt-out requests. It is an important enforcement example, not proof that every site everywhere has the same obligation.

## How to Check and Enable GPC

To verify if your browser is actively protecting your legal rights:

1. Visit [BrowserProbe's Do Not Track Test](/tools/do-not-track).
2. Look at the **Global Privacy Control** row.
3. If it displays "Enabled," your browser is correctly broadcasting your opt-out preferences.

To turn GPC on, use a browser that supports GPC natively:
- **Brave Browser**: GPC is enabled by default.
- **Mozilla Firefox**: Go to Settings -> Privacy & Security -> and check the box for "Tell websites not to sell or share my data".
- **Browser Extensions**: If you use Chrome or Edge, you can enable GPC by installing the **Privacy Badger** or **Opt-Out Easy** extension.

Enabling GPC is a low-friction way to express an opt-out preference. It does not block tracking by itself, and its legal effect depends on the applicable law and whether the business is covered.`,
  },
  {
    slug: "browser-data-leaks",
    title: "10 Browser API Signals Websites Can Observe",
    excerpt: "From graphics capabilities to media-device counts, here are 10 browser signals, their limits, and practical privacy tradeoffs.",
    date: "2026-04-15",
    readTime: "8 min read",
    category: "Privacy",
    content: `When you visit a page, browser APIs expose capabilities needed by web applications. Some results can also contribute to profiling when they are collected and combined at scale.

Here are 10 observable signals, what they can reveal, and the limitations that matter when interpreting them.

## 1. GPU Hardware Models (WebGL API)
The WebGL API provides access to hardware-accelerated graphics. When available, \`WEBGL_debug_renderer_info\` can return a renderer and vendor string. Browsers may expose an exact model, a generalized value, or a software renderer.

- **Risk**: Adds graphics-stack information to a broader profile.
- **Mitigation**: Built-in browser fingerprinting defenses may standardize or restrict the value; aggressive overrides can break graphics-heavy sites.

## 2. Battery Telemetry (Battery Status API)
The Battery Status API exposes your device's battery level percentage and remaining charging time. 

- **Risk**: Time-varying values can contribute a short-lived correlation signal where the API is available.
- **Mitigation**: Browser support is limited and values may be rounded. Check current browser policy rather than assuming the API is exposed.

## 3. Installed System Fonts
Websites can measure text render dimensions to test for the presence of hundreds of pre-installed system fonts.

- **Risk**: Having custom design or language fonts makes your browser configuration stand out in tracking indexes.
- **Solution**: Use a browser extension that blocks font measurement or enforces standard system fonts.

## 4. Local IP Leaks (WebRTC API)
WebRTC gathers ICE candidates to discover possible network paths. Candidates may include mDNS names, private addresses, public endpoints, or relay addresses.

- **Risk**: A routing problem can expose a public endpoint different from the VPN address; numeric local addresses reveal topology.
- **Mitigation**: Use a VPN that handles WebRTC, compare addresses, and follow current browser/VPN routing guidance.

## 5. Audio Processing Hashes (Web Audio API)
By rendering a known signal in an OfflineAudioContext, scripts can summarize differences in the browser and operating system's audio-processing implementation. Offline rendering does not pass through a physical DAC.

- **Risk**: A repeatable result can add one signal to a broader fingerprint.
- **Mitigation**: Browser randomization or standardization can reduce stability, with possible compatibility tradeoffs.

## 6. Timezone Offset & Locale Discrepancies
The \`Intl.DateTimeFormat().resolvedOptions().timeZone\` property exposes your system timezone (e.g., \`Asia/Kolkata\`).

- **Risk**: A timezone/IP mismatch may contribute to fraud or profiling models, but does not prove a physical location.
- **Mitigation**: Privacy browsers may standardize timezone. Manual spoofing can also create inconsistent signals.

## 7. Media Device Count (MediaDevices API)
Calling \`navigator.mediaDevices.enumerateDevices()\` returns the count and connection kinds (mic, speaker, webcam) connected to your computer.

- **Risk**: Device kinds and counts can add a signal; labels and identifiers are normally permission-gated.
- **Mitigation**: Review site permissions. Counts can remain visible or incomplete even without capture permission.

## 8. CPU Logical Cores (Hardware Concurrency)
\`navigator.hardwareConcurrency\` returns the number of logical CPU cores on your processor (e.g., 8, 12, or 16).

- **Risk**: Exposes a coarse hardware tier.
- **Mitigation**: Some browsers cap or standardize the value. Manual spoofing may cause compatibility issues.

## 9. Network Connection Estimates (Network Information API)
Exposes your connection type (Wi-Fi, cellular) and estimated download speeds.

- **Risk**: Adds coarse, changing network information where supported.
- **Mitigation**: Support varies by browser and values are estimates rather than a speed test.

## 10. Device Memory API
\`navigator.deviceMemory\` returns an approximate, rounded memory tier where supported.

- **Risk**: Categorizes your device category.
- **Mitigation**: Browser rounding and caps already reduce precision; blocking or spoofing may affect adaptive sites.

## Test Your Browser Leak Status
Visit the [BrowserProbe homepage](/) to inspect hardware, network, and privacy signals in one report. Use the evidence and limitation labels before deciding whether a setting change is useful.`,
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
