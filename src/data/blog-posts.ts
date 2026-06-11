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
    excerpt: "Learn how modern websites build a highly unique mathematical signature of your device without relying on cookies or local storage.",
    date: "2026-06-01",
    readTime: "8 min read",
    category: "Tracking",
    content: `Browser fingerprinting is a powerful, silent, and cookie-less tracking method used by websites to identify individual users. Unlike traditional tracking cookies that store a text file directly on your device, fingerprinting builds a unique mathematical identifier by gathering information about your web browser, operating system, hardware capabilities, and network connection.

Because this profile is generated from passive device characteristics that your browser naturally exposes to load pages, it is extremely difficult to bypass, reset, or prevent.

## The Shift from Cookies to Fingerprinting

For decades, websites relied on HTTP cookies to track users across sessions. When you visited a site, a unique cookie ID was saved to your storage. When you loaded a new page, your browser sent that cookie back, letting the server know you were the same visitor.

However, as browser privacy settings improved, search engines added tracking protection, and users began routinely clearing their cookies, advertisers needed a tracking method that didn't rely on local storage. 

> **Enter Browser Fingerprinting.** Instead of writing a tracking ID to your disk, websites *read* your device configuration to construct your tracking ID dynamically.

## How a Browser Fingerprint Is Structured

Every time your browser requests a web page, it shares dozens of properties to optimize how the page is displayed. Fingerprinting scripts gather these properties and combine them using a hashing algorithm (like MurmurHash3) to generate a short, unique alphanumeric string (e.g., \`4b7f938d2a1b\`).

Here are the primary components that feed into this signature:

### 1. User Agent and HTTP Headers
The \`User-Agent\` header contains details about your browser name, browser version, operating system, and hardware architecture. Additionally, the order and types of headers your browser sends (such as \`Accept\`, \`Accept-Language\`, and \`Accept-Encoding\`) provide unique signatures.

### 2. Screen and Display Configurations
Websites read your monitor's total resolution, available viewport dimensions (excluding toolbars), color depth, pixel depth, device pixel ratio (DPR), and orientation. Users with secondary monitors, custom scale factors, or custom window sizes create highly specific display fingerprints.

### 3. Rendering Engine & Hardware Acceleration (Canvas & WebGL)
By drawing hidden shapes and text on an HTML5 \`<canvas>\` or WebGL canvas, scripts analyze how your graphics card (GPU) renders imagery. Subtle differences in anti-aliasing, rasterization algorithms, and graphics card driver versions cause devices to render pixels slightly differently.

### 4. Font Enumeration
Fingerprinters check for the presence of hundreds of system fonts by measuring text dimensions using HTML element widths. A device with custom fonts installed (from design tools, office software, or localization packs) stands out significantly from standard configurations.

### 5. Timezones, Locale & Locales
The JavaScript \`Intl\` API exposes your exact local timezone, locale string, language list, calendar system, and default currency. If you use a VPN to change your IP address but leave your system timezone unchanged, websites can immediately flag the mismatch.

## Hashing and Entropy: The Math Behind the Track

In information theory, **entropy** measures the amount of uncertainty or uniqueness in a dataset, expressed in bits. A browser fingerprint has a specific entropy score. 

\`\`\`
Entropy (H) = - Σ (P(x) * log2(P(x)))
\`\`\`

Where \`P(x)\` is the probability of a specific configuration. If a specific fingerprint configuration occurs in only 1 out of 1,000,000 browsers, it provides roughly 20 bits of entropy. When a fingerprint achieves 33 bits of entropy, it has successfully isolated your browser from every other device on the internet.

## Actionable Mitigation Strategies

Traditional adblockers and incognito mode do not stop browser fingerprinting because your underlying hardware remains identical. To resist fingerprinting, you must reduce your entropy:

1. **Use Tor Browser**: Tor is the gold standard for fingerprint protection because all Tor users are forced to share the exact same standardized user agent, display dimensions, rendering pipeline, and font list. This makes all users look completely identical, reducing individual entropy to zero.
2. **Enable Farbling in Brave**: Brave shields use a technique called "farbling" or randomization. Instead of hiding your GPU or canvas outputs, Brave adds subtle, random mathematical noise to API results. Because the noise changes slightly on every visit, your fingerprint is constantly rotating, making it impossible for tracking databases to link your sessions.
3. **Use Firefox ResistFingerprinting (RFP)**: Entering \`about:config\` and enabling \`privacy.resistFingerprinting\` configures Firefox to act similarly to Tor Browser, capping display sizes, spoofing timezones, and restricting font checks.

Use [BrowserProbe's Homepage](/) diagnostic tools to see exactly how unique your browser fingerprint is today, and test if your privacy shields are successfully spoofing these trackers.`,
  },
  {
    slug: "webrtc-leak-prevention",
    title: "How to Test and Prevent WebRTC IP Leaks: The Complete Guide",
    excerpt: "WebRTC allows web apps to bypass VPN routing to discover your real local and public IP addresses. Learn how WebRTC leaks work and how to secure them.",
    date: "2026-05-20",
    readTime: "6 min read",
    category: "Security",
    content: `WebRTC (Web Real-Time Communication) is an open-source standard that enables web browsers to establish direct, peer-to-peer (P2P) connections for video calls, voice chat, and decentralized file sharing. While it powers seamless, plugin-free applications like Discord, Zoom, and Google Meet, WebRTC features a major privacy vulnerability: **it can leak your real IP address, even if you are using a VPN.**

This vulnerability allows third-party websites to bypass your encrypted VPN tunnel to read both your public and local IP addresses.

## How WebRTC Bypasses Your VPN

To understand how a WebRTC leak occurs, we must look at how browsers establish peer-to-peer connections. Because peer connections must bypass local firewalls and routers, the browser uses a protocol called **Interactive Connectivity Establishment (ICE)**.

ICE candidates are generated by querying external **STUN** (Session Traversal Utilities for NAT) servers. 

\`\`\`
[Browser] --- (Queries STUN Server) ---> [Google STUN Server]
[Browser] <--- (Returns Public IP) <--- [Google STUN Server]
\`\`\`

During this query, WebRTC opens a direct socket connection to the STUN server. Because this socket is established at the OS network level, many web browsers bypass the default routing tables set by VPN virtual network interfaces. 

As a result, the STUN query resolves your actual, underlying public IP address (provided by your local ISP) alongside your local network addresses (such as \`192.168.1.15\`).

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

Any tracker embedded in an ad network can run this script silently in the background of a web page and log your real location in under 100 milliseconds.

## How to Test for WebRTC Leaks

To verify if your privacy setup is leaking your network configuration:

1. Enable your VPN or proxy.
2. Visit [BrowserProbe's WebRTC Leak Test](/tools/webrtc-leak-test).
3. Check the "Leaked IPs" field.
4. If you see your **home ISP IP address** or **local IP addresses** (like \`10.x.x.x\` or \`192.168.x.x\`), your browser is actively leaking your real network identity.

## Step-by-Step Mitigation Guide

To secure your connection, you must instruct your browser to block ICE candidate enumeration or disable WebRTC altogether.

### 1. Mozilla Firefox (Native Control)
Firefox is the only browser that allows you to disable WebRTC entirely without third-party extensions:
- Type \`about:config\` in the Firefox address bar and accept the risk warning.
- Search for the flag: \`media.peerconnection.enabled\`.
- Double-click the flag to change its value from \`true\` to \`false\`.

*Note: This will prevent WebRTC-based video calling services from running in your browser.*

### 2. Google Chrome & Microsoft Edge
Chromium browsers do not expose a native toggle to turn off WebRTC, but you can configure WebRTC routing policies.
- Install the **WebRTC Leak Prevent** extension from the Chrome Web Store.
- Configure the extension to use the policy **"Disable non-proxied UDP"**. This forces all WebRTC traffic through your configured VPN/proxy interface, ensuring only the proxy's IP is revealed.

### 3. Brave Browser
Brave includes native WebRTC controls in its Shields settings.
- Open Brave Settings and navigate to **Shields**.
- Find the **WebRTC IP Handling Policy** dropdown.
- Select **Disable Non-Proxied UDP** or **Default Public Interface Only** to lock down ICE candidate leaks.

By configuring these routing settings, you can enjoy VPN security without completely breaking compatibility with web conferencing tools.`,
  },
  {
    slug: "canvas-fingerprinting-explained",
    title: "Canvas Fingerprinting: Renders, Hashes, and Silent Tracking",
    excerpt: "Explore the GPU-level details of HTML5 Canvas fingerprinting, why it is highly unique, and how websites use it for cookie-less tracking.",
    date: "2026-05-10",
    readTime: "7 min read",
    category: "Tracking",
    content: `HTML5 Canvas fingerprinting is one of the most widely deployed cookie-less tracking methods on the web. It operates entirely in the background, drawing hidden canvas graphics when you load a page, and extracting a unique hardware signature of your computer.

This article details the mechanics of canvas tracking, why it is so unique, and the technical strategies for blocking it.

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

## Why Are Canvas Hashes Unique?

You might expect that drawing the same text with the same font would produce the identical image on every computer. In reality, the output pixel array is highly dependent on your system's hardware and software stack:

- **Graphics Processing Unit (GPU)**: Different GPUs (Intel, NVIDIA, AMD, Apple M-Series) use different rasterization and anti-aliasing engines, leading to microscopic differences in sub-pixel colors.
- **Font Rendering Engines**: Operating systems handle font smoothing (ClearType on Windows vs. Quartz on macOS) differently, producing slight variations in text curves and outline geometries.
- **Drivers and Browser Versions**: GPU drivers and the browser's graphics rendering pipeline (ANGL, WebGL wrappers, etc.) introduce floating-point calculation differences that affect rendering coordinates.

Because of these hardware-level dependencies, the generated image hash is highly unique, acting as an excellent signature for tracking.

## How to Block Canvas Trackers

Defending your system against canvas fingerprinting requires either blocking the API altogether or altering its output.

### 1. Blanking/Blocking
The simplest defense is block-level protection. When a website calls \`toDataURL()\`, the browser blocks the call or returns an empty transparent image. The Tor Browser utilizes this method, prompting you for permission whenever a site attempts to read canvas data.

*The drawback*: Returning a blank canvas is highly unusual and immediately signals to the server that you are attempting to hide, making you stand out as a highly unique entity (increasing your overall behavioral uniqueness).

### 2. Canvas Randomization (Farbling)
The most elegant defense is randomization. Brave and privacy tools like the Canvas Blocker extension intercept the canvas drawing functions and inject subtle, invisible mathematical noise into the output data. 

This noise changes slightly on every page load or visit. Because the generated base64 image data changes, the resulting hash is completely different every time you reload, rendering persistent tracking databases useless.

Check out [BrowserProbe's Canvas Fingerprint Tool](/tools/canvas-fingerprint) to view the actual hidden graphic generated by your browser and examine your device's fingerprint hash in real time.`,
  },
  {
    slug: "do-not-track-vs-gpc",
    title: "Is Do Not Track Dead? Understanding GPC and Modern Privacy Laws",
    excerpt: "Do Not Track failed because it was voluntary. Global Privacy Control (GPC) is legally enforceable. Learn the difference.",
    date: "2026-04-28",
    readTime: "5 min read",
    category: "Privacy",
    content: `In 2009, privacy researchers proposed **Do Not Track (DNT)** — a simple HTTP request header that users could toggle in browser settings. The concept was straightforward: if a browser sent the header \`DNT: 1\`, websites were requested to disable tracking cookies, behavioral profiles, and data sharing.

While DNT was adopted by major browsers, it is now considered dead. Today, its successor — **Global Privacy Control (GPC)** — is taking its place with one massive advantage: **it is legally enforceable.**

## Why Do Not Track Failed

The fatal flaw of Do Not Track was its voluntary nature. DNT was a polite request, not a legal mandate. 

When the header was finalized, major ad tech companies and data brokers openly ignored it. There was no regulatory penalty for tracking users who had DNT enabled. In 2012, Internet Explorer enabled DNT by default, prompting the advertising lobby to argue that the signal did not represent active user choice, rendering it invalid.

Standardization groups reached a deadlock, and the W3C tracking protection working group officially disbanded in 2019. 

In fact, DNT became counterproductive: because DNT was rarely enabled by default, having the header active actually added entropy to your browser profile, making your browser *more* unique and easier to fingerprint.

## The Rise of Global Privacy Control (GPC)

Global Privacy Control (GPC) was created by a coalition of privacy organizations, browser vendors, and legal experts to succeed DNT. 

GPC works under the hood via two methods:
1. **An HTTP Header**: Your browser sends \`Sec-GPC: 1\` with every web request.
2. **A JavaScript Property**: The browser exposes the property \`navigator.globalPrivacyControl\` set to \`true\`.

\`\`\`
[Browser (Sec-GPC: 1)] ---> [Website Server] ---> Read GPC, Opt-Out User
\`\`\`

The crucial difference: **GPC has legal teeth.**

Under modern privacy regulations like the **California Consumer Privacy Act (CCPA)** and the **General Data Protection Regulation (GDPR)**, websites are legally required to treat a GPC signal as a valid, user-initiated request to opt out of the sale or sharing of their personal information.

In 2022, the California Attorney General fined a major beauty brand $1.2 million for failing to honor GPC signals, setting a clear legal precedent: **ignoring GPC is a violation of consumer privacy law.**

## How to Check and Enable GPC

To verify if your browser is actively protecting your legal rights:

1. Visit [BrowserProbe's Do Not Track Test](/tools/do-not-track).
2. Look at the **Global Privacy Control** row.
3. If it displays "Enabled," your browser is correctly broadcasting your opt-out preferences.

To turn GPC on, use a browser that supports GPC natively:
- **Brave Browser**: GPC is enabled by default.
- **Mozilla Firefox**: Go to Settings -> Privacy & Security -> and check the box for "Tell websites not to sell or share my data".
- **Browser Extensions**: If you use Chrome or Edge, you can enable GPC by installing the **Privacy Badger** or **Opt-Out Easy** extension.

By switching to GPC, your request is no longer a polite ask — it is a legal command that websites ignore at their own financial risk.`,
  },
  {
    slug: "browser-data-leaks",
    title: "10 Surprising Browser API Data Leaks (and How to Stop Them)",
    excerpt: "From battery telemetry to exact GPU hardware models, here are 10 ways your browser silently leaks private data to websites.",
    date: "2026-04-15",
    readTime: "8 min read",
    category: "Privacy",
    content: `Every time you click a link or visit a web page, your browser shares a wealth of details about your computer, screen, local network, and hardware configurations. While browser APIs are designed to make web apps powerful, they are also exploited by advertisers to leak personal data.

Here are 10 browser APIs that leak data, why they pose a privacy risk, and how to lock down your system.

## 1. GPU Hardware Models (WebGL API)
The WebGL API provides access to hardware-accelerated graphics. However, calling \`gl.getParameter(gl.getExtension('WEBGL_debug_renderer_info').UNMASKED_RENDERER_WEBGL)\` leaks your exact graphics card manufacturer and card model (e.g., \`NVIDIA GeForce RTX 4070/PCIe/SSE2\`). 

- **Risk**: High uniqueness for custom GPU drivers.
- **Solution**: Use Brave or Firefox with ResistFingerprinting to spoof the GPU model as a generic renderer.

## 2. Battery Telemetry (Battery Status API)
The Battery Status API exposes your device's battery level percentage and remaining charging time. 

- **Risk**: Precision metrics (like \`0.841392\`) update constantly, creating a temporary tracking identifier that allows scripts to follow your sessions across private windows.
- **Solution**: Modern browsers like Safari and Firefox have removed this API. If you use Chrome, you can block it using permissions managers.

## 3. Installed System Fonts
Websites can measure text render dimensions to test for the presence of hundreds of pre-installed system fonts.

- **Risk**: Having custom design or language fonts makes your browser configuration stand out in tracking indexes.
- **Solution**: Use a browser extension that blocks font measurement or enforces standard system fonts.

## 4. Local IP Leaks (WebRTC API)
WebRTC queries STUN servers to resolve networking paths, revealing your local network IP (like \`192.168.1.42\`) and bypassing VPN tunnels.

- **Risk**: Exposes your actual ISP IP even behind a VPN.
- **Solution**: Turn off WebRTC in Firefox settings or install a routing blocker on Chromium browsers.

## 5. Audio Processing Hashes (Web Audio API)
By rendering an inaudible audio wave in an OfflineAudioContext, scripts analyze sub-pixel math discrepancies in your sound card's digital-to-analog converter (DAC).

- **Risk**: Permanent hardware fingerprint.
- **Solution**: Use Brave or extensions to add mathematical noise to AudioContext outputs.

## 6. Timezone Offset & Locale Discrepancies
The \`Intl.DateTimeFormat().resolvedOptions().timeZone\` property exposes your system timezone (e.g., \`Asia/Kolkata\`).

- **Risk**: If your VPN routes through the US but your timezone remains local, ad networks flag the location discrepancy.
- **Solution**: Spoof your timezone or configure your browser to match your VPN location.

## 7. Media Device Count (MediaDevices API)
Calling \`navigator.mediaDevices.enumerateDevices()\` returns the count and connection kinds (mic, speaker, webcam) connected to your computer.

- **Risk**: Users with multiple audio input/output routes are easily identified.
- **Solution**: Restrict Media Device permissions to block device enumeration.

## 8. CPU Logical Cores (Hardware Concurrency)
\`navigator.hardwareConcurrency\` returns the number of logical CPU cores on your processor (e.g., 8, 12, or 16).

- **Risk**: Exposes hardware tiers.
- **Solution**: Spoof this value to a generic standard (e.g., 4 or 8) in privacy settings.

## 9. Network Connection Estimates (Network Information API)
Exposes your connection type (Wi-Fi, cellular) and estimated download speeds.

- **Risk**: Adds extra bits of entropy to your fingerprint.
- **Solution**: Use Firefox or Safari which block this API.

## 10. Device Memory API
\`navigator.deviceMemory\` returns the approximate amount of RAM in gigabytes (e.g., 2, 4, or 8 GB).

- **Risk**: Categorizes your device category.
- **Solution**: Spoof this property to a standard level.

## Test Your Browser Leak Status
Visit the [BrowserProbe Homepage](/) to run all 10 hardware, network, and privacy tests instantly in a single scan. Make sure your privacy blockers are configured correctly to hide your device signatures!`,
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
