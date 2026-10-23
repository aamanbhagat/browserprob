export type BlogCategory = "Fingerprinting" | "Network" | "Privacy controls" | "Browser & display";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  /** First published (ISO date). */
  date: string;
  /** Last substantive revision (ISO date). */
  updated: string;
  readTime: string;
  category: BlogCategory;
  /** The tool this guide is about, linked from the sidebar. */
  relatedTool: string;
  content: string;
  sources: { title: string; url: string }[];
}

export const BLOG_CATEGORIES: BlogCategory[] = ["Fingerprinting", "Network", "Privacy controls", "Browser & display"];

export const blogPosts: BlogPost[] = [
  {
    slug: "what-is-browser-fingerprinting",
    title: "What Is Browser Fingerprinting? How It Works and What Limits It",
    excerpt: "How websites combine ordinary browser values into a probabilistic identifier without cookies, why no single value proves identity, and which defenses actually help.",
    date: "2026-06-01",
    updated: "2026-10-23",
    readTime: "8 min read",
    category: "Fingerprinting",
    relatedTool: "canvas-fingerprint",
    content: `Browser fingerprinting is the practice of recognizing a browser by the combination of characteristics it reveals, instead of by an identifier stored on it. A cookie is something a site puts on your device and reads back later. A fingerprint is something a site computes, again and again, from what your browser already exposes.

The W3C's guidance on fingerprinting separates two kinds. **Passive** fingerprinting uses only what arrives with ordinary requests, such as the IP address, the User-Agent header and accepted languages. **Active** fingerprinting runs code in the page to observe more, such as screen size, canvas rendering, fonts or GPU details. Passive fingerprinting is invisible to the browser; active fingerprinting at least happens inside the page, where it can in principle be observed and limited.

## Why fingerprinting exists alongside cookies

Cookies are easy to see, easy to delete and increasingly restricted. Safari blocks third-party cookies outright, and Firefox keeps them separate for each site. A fingerprint survives clearing cookies and private windows in many browsers, because it is recomputed from the browser's configuration rather than read from storage. That is what makes it attractive to trackers and fraud-detection systems alike. Banks use similar signals to notice that a login comes from an unfamiliar device.

## What goes into a fingerprint

Almost any value that differs between browsers can contribute:

- **Browser and system identity:** the user-agent string and, in Chromium browsers, Client Hints.
- **Display:** screen and window sizes, device pixel ratio, colour depth.
- **Rendering:** how a canvas drawing or a Web Audio signal comes out, which depends on fonts, graphics stack and engine version.
- **Installed fonts,** tested one name at a time by measuring text.
- **Hardware hints:** CPU thread count, rounded memory, the GPU renderer string.
- **Settings:** time zone, language list, Do Not Track, and whether cookies are enabled.
- **Network:** the IP address, which is not strictly part of the browser but is almost always combined with it.

A script typically gathers these values and hashes them into one identifier. Hashing makes the result compact; it adds no information and proves nothing by itself.

## How identifying is a fingerprint?

The question is always "identifying among whom". Information theory measures it in bits. A value shared by half of all browsers carries one bit; one shared by one in a million carries about 20. In 2010, the EFF's Panopticlick study by Peter Eckersley found that the fingerprints it collected carried at least 18.1 bits of entropy. In other words, a randomly picked browser shared its fingerprint with roughly one in 286,777 others, and 94.2% of browsers with Flash or Java were unique in that sample.

The web has changed since then. Plugins are gone, user-agent strings are frozen, and browsers round hardware values. What has not changed is the principle: many individually common values become rare in combination. Equally important, rarity can only be estimated against a population. A website that shows you a single visit's results cannot know how unique you are, and BrowserProbe deliberately doesn't claim to.

Fingerprints also drift. A browser update changes the user-agent and sometimes the canvas or audio output, and a new monitor changes the screen values. Trackers handle this by linking a slightly changed fingerprint to the old one. That works better the more stable the other values are.

## What actually reduces fingerprinting

Two strategies work. They pull in opposite directions:

1. **Look like everyone else.** Tor Browser standardizes as many values as it can, so its users share one large "anonymity set". It rounds window sizes ("letterboxing"), ships a fixed font set and reports uniform values.
2. **Be different every time.** Brave adds small random changes to canvas, audio and other outputs, using a seed that changes per site and per session. A tracker on one site therefore can't match you with the same tracker on another site, or in your next session.

Mainstream browsers now apply milder versions of these ideas. Safari restricts fonts to those bundled with the system and adds noise to fingerprintable APIs in Private Browsing. Firefox 145 added a new set of fingerprinting protections that apply in Private Browsing and with Enhanced Tracking Protection set to Strict.

What tends not to help: piling up privacy extensions or spoofing individual values. Each change makes your configuration less common, and an inconsistent combination, such as an iPhone user-agent with a desktop GPU, is distinctive in its own right. The W3C note is blunt about the overall picture: completely eliminating fingerprinting by technical means alone is not plausible. Browser defaults and limits on what each API reveals are what move the needle.

## Seeing your own signals

BrowserProbe's [home page check](/) shows the main signals your browser exposes, and each [individual test](/tools) explains one of them in detail. The results describe what this browser reveals right now. They are not a uniqueness score, because one site's visitors are not a meaningful population for that.`,
    sources: [
      { title: "W3C Group Note: Mitigating Browser Fingerprinting in Web Specifications", url: "https://www.w3.org/TR/fingerprinting-guidance/" },
      { title: "Eckersley, P. (2010). How Unique Is Your Web Browser? Electronic Frontier Foundation", url: "https://coveryourtracks.eff.org/static/browser-uniqueness.pdf" },
      { title: "Brave: Fingerprinting protections", url: "https://github.com/brave/brave-browser/wiki/Fingerprinting-Protections" },
      { title: "WebKit: Tracking Prevention in WebKit", url: "https://webkit.org/tracking-prevention/" },
      { title: "Firefox 145.0 release notes", url: "https://www.firefox.com/en-US/firefox/145.0/releasenotes/" },
    ],
  },
  {
    slug: "webrtc-leak-prevention",
    title: "How to Test and Prevent WebRTC IP Leaks",
    excerpt: "How WebRTC's ICE candidates can expose addresses outside a VPN, how to tell a real leak from a normal result, and the settings that fix it.",
    date: "2026-05-20",
    updated: "2026-10-23",
    readTime: "7 min read",
    category: "Network",
    relatedTool: "webrtc-leak-test",
    content: `WebRTC is the browser technology behind video calls, screen sharing and peer-to-peer file transfer. To connect two devices directly, it has to work out which network addresses each one can be reached at. That discovery can reveal more than you expect, in particular your real public address while a VPN is active.

This guide explains where the addresses come from, how to recognize an actual leak, and how to stop one.

## How WebRTC finds network paths

Most devices sit behind a router that translates addresses (NAT), so two peers can rarely just connect to each other. WebRTC uses a procedure called ICE (Interactive Connectivity Establishment). It gathers **candidates**, possible addresses for the connection, and then tests them in pairs.

There are three main kinds of candidate:

- **Host candidates** are addresses of the device's own network interfaces. For a laptop on home Wi-Fi, that is usually a private address such as \`192.168.1.20\`.
- **Server-reflexive (srflx) candidates** come from asking a STUN server "what address do you see me as?". The answer is the public address and port of the route the request took.
- **Relay candidates** belong to a TURN server that forwards traffic when no direct path works.

A web page can start this gathering with just a data channel, without asking for camera or microphone access, and read every candidate as it arrives.

## Where the leak comes from

A VPN is supposed to make every connection leave through the VPN tunnel, so websites only see the VPN's exit address. Two things can break that for WebRTC:

1. **STUN traffic takes a different route.** If the VPN only routes some traffic (split tunnelling), or the operating system sends UDP to the STUN server over the normal network, the STUN server sees, and reports back, your provider's real public address. It then appears in a server-reflexive candidate that any page can read.
2. **Host candidates reveal local addresses.** Older browsers put the device's private addresses straight into host candidates. That doesn't expose your public address, but it does describe your local network.

Browsers addressed the second problem by default. Current browsers replace local addresses with random \`.local\` names (multicast DNS), at least until the page has been granted camera or microphone access. RFC 8828 describes how browsers should limit which addresses WebRTC uses at all. Its recommended default, without user consent, is to use only the interface on the default route, which keeps WebRTC traffic on the same path as your normal browsing.

## Telling a real leak from a normal result

A public address in a WebRTC result is not automatically a leak. Ask three questions:

- **Is it the same address websites already see?** If the server-reflexive address matches the IP your normal page requests come from, nothing new was revealed.
- **Is it the other IP family?** Many connections have both an IPv4 and an IPv6 address. If the page loaded over IPv4 and WebRTC also shows an IPv6 address, that may simply be the same connection's other address. Check whether it belongs to your VPN.
- **Does it belong to your own provider while the VPN is on?** That is the leak. The address that should be hidden is visible to every page that runs the same short script.

The [BrowserProbe WebRTC test](/tools/webrtc-leak-test) runs the gathering for you, lists every candidate with its type, and compares the addresses with the one your page request came from.

## A minimal example

This is roughly what a page needs to read candidate addresses. It does not need any permission:

\`\`\`javascript
const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.cloudflare.com:3478" }] });
pc.createDataChannel("");
pc.onicecandidate = ({ candidate }) => {
  if (!candidate) return; // gathering finished
  // Candidate lines look like: "candidate:… 1 udp 1686052607 203.0.113.9 54321 typ srflx …"
  const [, , protocol, , address, , , type] = candidate.candidate.split(" ");
  console.log(type, protocol, address);
};
await pc.setLocalDescription(await pc.createOffer());
\`\`\`

## How to fix a WebRTC leak

1. **Use your VPN's leak protection.** Many VPN clients have a WebRTC or "block non-VPN traffic" option, and full-tunnel mode avoids split-tunnel routes.
2. **Firefox:** set \`media.peerconnection.enabled\` to \`false\` in \`about:config\` to switch WebRTC off entirely. Browser-based calls will stop working.
3. **Chrome and Edge (managed devices):** the \`WebRtcIPHandling\` enterprise policy restricts WebRTC to the default public interface, or to traffic that goes through a proxy.
4. **Brave:** the privacy settings include a WebRTC IP handling policy with similar choices.
5. **Test again** after every change, with the VPN on, and check that the calling services you need still work.

Disabling WebRTC is the bluntest fix and rarely necessary. Correct routing in the VPN client keeps calls working and closes the leak.`,
    sources: [
      { title: "RFC 8828: WebRTC IP Address Handling Requirements", url: "https://www.rfc-editor.org/rfc/rfc8828.html" },
      { title: "IETF draft: Using Multicast DNS to protect privacy when exposing ICE candidates", url: "https://datatracker.ietf.org/doc/html/draft-ietf-mmusic-mdns-ice-candidates" },
      { title: "MDN: RTCIceCandidate.type", url: "https://developer.mozilla.org/en-US/docs/Web/API/RTCIceCandidate/type" },
    ],
  },
  {
    slug: "canvas-fingerprinting-explained",
    title: "Canvas Fingerprinting: How Drawing an Image Can Identify a Browser",
    excerpt: "Why the same drawing renders slightly differently across devices, how scripts turn that into an identifier, and how browsers now blur or randomize it.",
    date: "2026-05-10",
    updated: "2026-10-23",
    readTime: "6 min read",
    category: "Fingerprinting",
    relatedTool: "canvas-fingerprint",
    content: `Canvas fingerprinting relies on a simple observation: ask a thousand browsers to draw the same picture, and the pixels will not all come out identical. A script can draw a fixed image in a hidden canvas, read the pixels back and summarize them. The result tells it something about the software and hardware that drew the picture, without storing anything on your device.

## The technique step by step

1. **Create a canvas that is never shown.** A script makes a \`<canvas>\` element in memory; it never needs to be added to the visible page.
2. **Draw something that stresses rendering.** Typical choices are text in several fonts and sizes, emoji, overlapping semi-transparent shapes, gradients and curves. These exercise font rasterization, anti-aliasing and colour blending.
3. **Read the pixels back,** with \`toDataURL()\` (an encoded PNG) or \`getImageData()\` (raw pixel values).
4. **Reduce the result to a short value** with a hash function, so it can be stored and compared.

\`\`\`javascript
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
ctx.font = "16px Arial";
ctx.fillText("Hello, canvas 👋", 4, 20);
const bytes = new TextEncoder().encode(canvas.toDataURL());
const digest = await crypto.subtle.digest("SHA-256", bytes);
console.log([...new Uint8Array(digest)].slice(0, 8).map((b) => b.toString(16).padStart(2, "0")).join(""));
\`\`\`

## Why the pixels differ

The canvas API specifies what to draw, not exactly which pixels result. Several layers fill in that gap:

- **Font rendering:** different operating systems smooth and hint text differently, and the installed version of a font matters.
- **Graphics stack:** the GPU, its driver and the browser's graphics backend can produce slightly different anti-aliasing and blending.
- **Emoji:** each platform ships its own emoji font, so the same character can look completely different.
- **Browser version:** engine updates change rendering code.

Most people with the same browser, operating system and hardware get the same result. The value separates groups, not individuals. It becomes identifying in combination with other signals.

## Defenses and their trade-offs

Browsers handle canvas readback in three broad ways:

- **Randomization.** Brave alters canvas output slightly, using a seed that changes per site and per session. Within one page the value stays constant, but a tracker sees different values on different sites and in later sessions. Safari adds noise to fingerprintable APIs in Private Browsing.
- **Blocking or prompting.** Tor Browser asks before letting a site read canvas data and otherwise returns a blank image. Firefox's strongest setting, \`privacy.resistFingerprinting\`, does similar things.
- **Doing nothing visible.** Several mainstream browsers in their default modes return the real pixels.

Each approach has costs. Blocking breaks legitimate drawing apps that need to export images. Randomizing can, in rare cases, show up as faint visual noise. Unusual extensions that block canvas may themselves be a rare signal.

## Testing your own browser

The [BrowserProbe canvas test](/tools/canvas-fingerprint) draws a fixed image twice, shows it to you, and compares the two reads. If they differ, your browser adds per-read noise. If they match, your browser either does nothing, or uses a session-scoped seed like Brave's. Comparing the ID across two different sites, or after restarting the browser, tells those two cases apart.`,
    sources: [
      { title: "MDN: HTMLCanvasElement.toDataURL()", url: "https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL" },
      { title: "Brave: Fingerprinting protections", url: "https://github.com/brave/brave-browser/wiki/Fingerprinting-Protections" },
      { title: "WebKit: Features in Safari 17.0", url: "https://webkit.org/blog/14445/webkit-features-in-safari-17-0/" },
      { title: "W3C Group Note: Mitigating Browser Fingerprinting in Web Specifications", url: "https://www.w3.org/TR/fingerprinting-guidance/" },
    ],
  },
  {
    slug: "do-not-track-vs-gpc",
    title: "Do Not Track vs Global Privacy Control: Which Signal Still Matters",
    excerpt: "Why Do Not Track faded out, how Global Privacy Control differs, where GPC carries legal weight, and how to turn it on.",
    date: "2026-04-28",
    updated: "2026-10-23",
    readTime: "6 min read",
    category: "Privacy controls",
    relatedTool: "do-not-track",
    content: `Both Do Not Track and Global Privacy Control let your browser tell every website you visit what you want, with no banner to click. Do Not Track was the first attempt and is now mostly gone. Global Privacy Control is its successor, and the important difference is that some laws give it teeth.

## The rise and fall of Do Not Track

Do Not Track (DNT) was proposed around 2009 as a simple HTTP header, \`DNT: 1\`, which browsers could send when the user switched it on. Browsers adopted it quickly. Websites mostly did not.

The problem was enforcement. DNT was a polite request with no legal obligation behind it in most places. Industry groups also disputed what "tracking" meant. When Internet Explorer 10 turned DNT on by default in 2012, advertisers argued the signal no longer reflected a deliberate user choice. The W3C working group that was standardizing it closed in 2019 without a finished standard.

DNT also had a side effect: a header that some browsers send and others don't is one more thing that distinguishes them. Safari removed DNT for exactly that reason. Firefox removed its DNT checkbox in version 135 and pointed users to its GPC setting instead. Chrome still offers it, under Settings → Privacy and security → Third-party cookies. Google's own help page says most websites, including Google's, don't change their behavior when they receive it.

## What Global Privacy Control is

Global Privacy Control (GPC) works the same way technically: browsers send a \`Sec-GPC: 1\` header and expose \`navigator.globalPrivacyControl\` to scripts. The meaning is narrower and more concrete: "do not sell or share my personal information".

That narrower meaning lines up with rights that some privacy laws already give people. In California, the Attorney General states that covered businesses must honor a user-enabled GPC signal as a valid request to opt out of the sale or sharing of personal information. In 2022, the Attorney General's settlement with the retailer Sephora included allegations that it had failed to process such opt-out requests.

GPC's specification is careful about its scope. It says that sending and receiving the signal may have legal effects depending on factors such as the user's location, and that it is not necessarily intended to invoke every privacy right in every jurisdiction. It is not a GDPR mechanism. In the EU, consent rules work differently.

## Where GPC is available

According to the GPC project:

- **Brave** and **DuckDuckGo's browser** send GPC by default.
- **Firefox** has it as a setting since version 120: Settings → Privacy & Security → Website Privacy Preferences → "Tell websites not to sell or share my data".
- **Chrome and Edge** don't have a built-in switch. Extensions such as Privacy Badger, OptMeowt and Disconnect send the signal.
- **Safari** doesn't support it.

## What either signal can and cannot do

Neither signal blocks a single request. Trackers still load and cookies still get set, unless other protections stop them. GPC is a legal instruction to businesses that are bound by laws recognizing it. DNT is a request that almost nobody is bound by.

Turning GPC on is low-effort and has a real effect with covered businesses. Treat it as a complement to tracker blocking, not a replacement.

You can check what your browser sends with the [Do Not Track and GPC test](/tools/do-not-track).`,
    sources: [
      { title: "W3C: Global Privacy Control specification", url: "https://w3c.github.io/gpc/" },
      { title: "California Attorney General: California Consumer Privacy Act (CCPA)", url: "https://oag.ca.gov/privacy/ccpa" },
      { title: "Global Privacy Control: supporting browsers and extensions", url: "https://globalprivacycontrol.org/" },
      { title: "Firefox 135.0 release notes (Do Not Track checkbox removed)", url: "https://www.firefox.com/en-US/firefox/135.0/releasenotes/" },
      { title: "WebKit: Tracking Prevention in WebKit (Do Not Track removed)", url: "https://webkit.org/tracking-prevention/" },
      { title: "Google Chrome Help: Turn \"Do Not Track\" on or off", url: "https://support.google.com/chrome/answer/2790761" },
    ],
  },
  {
    slug: "browser-data-leaks",
    title: "10 Browser Signals Every Website Can Read",
    excerpt: "From GPU strings to media-device counts: ten values any page can read without asking, how precise each really is today, and what limits them.",
    date: "2026-04-15",
    updated: "2026-10-23",
    readTime: "8 min read",
    category: "Fingerprinting",
    relatedTool: "hardware-info",
    content: `Web pages need some information about the browser to work well: how big the screen is, whether the GPU can run WebGL, which language to show. Each of these values is harmless on its own. Collected together, they are the raw material of fingerprinting.

Here are ten signals any page can read without a permission prompt, with how precise each one is in current browsers.

## 1. The GPU renderer string

WebGL lets a page ask which graphics renderer it is using. Chromium browsers give the full driver string, often in the form \`ANGLE (vendor, model, backend)\`. Safari reports a generic "Apple GPU", and Firefox returns a sanitized string. A named workstation or gaming GPU narrows the population considerably. See the [WebGL test](/tools/webgl-info).

## 2. Logical CPU cores

\`navigator.hardwareConcurrency\` reports the number of hardware threads. Chrome and Firefox report the real count. Safari clamps it to 4 or 8, and some privacy modes report a fixed value.

## 3. Device memory

\`navigator.deviceMemory\` exists only in Chromium browsers. It is rounded to a power of two and clamped. Since Chrome 147, desktop values are 2, 4, 8, 16 or 32 GB (8 was the maximum before), and Android values are 1 to 8 GB.

## 4. Battery status

The Battery Status API is available only in Chromium browsers. Firefox removed it in version 52 after researchers showed that precise battery levels and discharge times could briefly link visits across sites. Safari never shipped it.

## 5. Fonts

Pages can't list fonts, but they can test whether a named font changes the size of rendered text. Fonts you installed yourself make a list less common. Safari only exposes fonts bundled with the operating system and web fonts. See the [font test](/tools/font-detection).

## 6. Canvas and audio rendering

Drawing an image or rendering a sound offline produces output that varies with fonts, graphics stack and engine. Brave randomizes both per site and session, and Safari adds noise in Private Browsing. See the [canvas test](/tools/canvas-fingerprint) and [audio test](/tools/audio-fingerprint).

## 7. Screen and window sizes

Screen resolution, available area, window size and device pixel ratio are all readable. An unusual window size, for example after dragging the window to an odd shape, can be quite distinctive. Tor Browser rounds window sizes for that reason.

## 8. Time zone and languages

The \`Intl\` API reveals your time zone, and \`navigator.languages\` your language list. Both are shared by many people. They become telling in combination, and when they don't match your IP address's location.

## 9. Media devices

Without permission, a page can enumerate cameras, microphones and speakers, but browsers limit what it gets. Chromium browsers return at most one nameless entry per kind until you grant access. After you grant camera or microphone access, the full list with device names becomes visible. See the [media devices test](/tools/media-devices).

## 10. Network information

In Chromium browsers, \`navigator.connection\` gives an effective connection type and coarse downlink and round-trip estimates. Downlink is capped at 10 Mbps and round-trip time at 3,000 ms, as anti-fingerprinting measures. Firefox and Safari don't expose it.

## What this adds up to

Browser makers have spent years making each of these values coarser: rounding, clamping, freezing or removing them. What remains still differs between browsers, which is why fingerprinting works, but much less than it did a decade ago.

The practical lessons:

- **Your browser's defaults matter more than extensions.**
- **A common configuration hides better than a customized one.**
- **No single value identifies you.**

The [BrowserProbe home page check](/) shows most of these signals for your own browser in one report.`,
    sources: [
      { title: "MDN: Navigator.deviceMemory", url: "https://developer.mozilla.org/en-US/docs/Web/API/Navigator/deviceMemory" },
      { title: "MDN: Navigator.hardwareConcurrency", url: "https://developer.mozilla.org/en-US/docs/Web/API/Navigator/hardwareConcurrency" },
      { title: "MDN: Battery Status API", url: "https://developer.mozilla.org/en-US/docs/Web/API/Battery_Status_API" },
      { title: "MDN: Network Information API", url: "https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API" },
      { title: "WebKit: Tracking Prevention in WebKit", url: "https://webkit.org/tracking-prevention/" },
    ],
  },
  {
    slug: "user-agent-client-hints",
    title: "User-Agent Client Hints: What Replaced the User-Agent String",
    excerpt: "Why browsers froze the user-agent string, how Client Hints split it into named values that sites must ask for, and what that means for developers and privacy.",
    date: "2026-10-23",
    updated: "2026-10-23",
    readTime: "7 min read",
    category: "Browser & display",
    relatedTool: "client-hints",
    content: `For three decades, every browser has introduced itself to every website with a single line of text: the user-agent string. That line grew long and confusing, sites parsed it badly, and it handed out a lot of identifying detail to everyone. User-Agent Client Hints are the Chromium project's answer. The browser shares a few basic facts by default and the rest only when a site asks.

## What was wrong with the user-agent string

A typical user-agent string is a pile of historical compatibility tokens. Chrome's version claims to be "Mozilla", "AppleWebKit", "KHTML, like Gecko" and "Safari", all at once. Websites parse it with regular expressions, often wrongly, and serve broken pages to browsers they misidentify.

It was also a privacy problem. The full string, with exact browser build, operating-system version and, on Android, the phone model, went out with every request to every server. That is **passive** fingerprinting surface: the server learns it without running any code, and the browser can't tell who used it.

## User-agent reduction

Chromium-based browsers responded by freezing most of the string. The exact operating-system version, the device model and the minor browser version are replaced with fixed values:

- \`Windows NT 10.0; Win64; x64\` on every version of Windows 10 and 11;
- \`Macintosh; Intel Mac OS X 10_15_7\` on every Mac;
- \`Linux; Android 10; K\` on every Android device;
- \`0.0.0\` in place of the minor version, as in \`Chrome/143.0.0.0\`.

The major version is still real. Safari has frozen the macOS version in its string too. Firefox has not adopted Client Hints and still sends its own, comparatively short, string.

## How Client Hints work

Client Hints come in two tiers.

**Low-entropy hints** are sent with every request as headers, and are available to scripts through \`navigator.userAgentData\`:

\`\`\`text
Sec-CH-UA: "Chromium";v="143", "Google Chrome";v="143", "Not)A;Brand";v="8"
Sec-CH-UA-Mobile: ?0
Sec-CH-UA-Platform: "Windows"
\`\`\`

**High-entropy hints** are only provided on request. A server asks for them with an \`Accept-CH\` response header, and the browser includes them in later requests to that site. A script asks with \`getHighEntropyValues()\`:

\`\`\`javascript
const hints = await navigator.userAgentData.getHighEntropyValues([
  "platformVersion", "architecture", "bitness", "model", "fullVersionList",
]);
\`\`\`

The available high-entropy values are architecture, bitness, form factors, full version list, model, platform version and WoW64. The odd "Not)A;Brand" entry is called GREASE. The specification requires browsers to include an arbitrary extra brand, so that sites don't hard-code an exact list.

## Why the split matters for privacy

The detailed values haven't disappeared. A site that wants them can still get them. What changed is that a site has to ask. Asking is visible: in a server's \`Accept-CH\` header, or in a script call that browser tools and researchers can observe. That turns passive fingerprinting into active fingerprinting, which the W3C's fingerprinting guidance treats as preferable because it can be detected and limited.

Browsers can also decide what to return. From Chrome 144, the high-entropy values can be restricted through Permissions-Policy, so a site can stop embedded third parties from receiving them.

## What developers gain

Some questions can only be answered with Client Hints. Microsoft documents that Windows 11 is distinguishable from Windows 10 only through the platform version hint, which is 13 or higher on Windows 11. CPU architecture and bitness let a download page offer the right installer for an ARM laptop.

Because Firefox and Safari don't implement Client Hints, sites still need a sensible fallback. Feature detection, rather than browser detection, remains the more robust approach for most purposes.

## See your own values

The [Client Hints test](/tools/client-hints) shows the low- and high-entropy values your browser returns, and which ones it withholds. The [What Is My Browser page](/tools/what-is-my-browser) shows the reduced user-agent string next to them.`,
    sources: [
      { title: "WICG: User-Agent Client Hints (Draft Community Group Report)", url: "https://wicg.github.io/ua-client-hints/" },
      { title: "MDN: User-Agent reduction", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/User-agent_reduction" },
      { title: "Chrome for Developers: User-Agent Client Hints", url: "https://developer.chrome.com/docs/privacy-security/user-agent-client-hints" },
      { title: "Microsoft Learn: Detect Windows 11 and CPU architecture using User-Agent Client Hints", url: "https://learn.microsoft.com/en-us/microsoft-edge/web-platform/how-to-detect-win11" },
      { title: "W3C Group Note: Mitigating Browser Fingerprinting in Web Specifications", url: "https://www.w3.org/TR/fingerprinting-guidance/" },
    ],
  },
  {
    slug: "cookies-storage-partitioning",
    title: "Cookies, Local Storage and Partitioning: Who Can Store What in Your Browser",
    excerpt: "First-party versus third-party storage, how Safari, Firefox and Chrome now differ, what partitioned cookies are, and what to do when a site keeps logging you out.",
    date: "2026-10-23",
    updated: "2026-10-23",
    readTime: "8 min read",
    category: "Privacy controls",
    relatedTool: "cookies-test",
    content: `"Cookies" has become shorthand for all the ways websites remember things in your browser. In reality there are several storage mechanisms, and modern browsers treat them very differently depending on one question: are you storing data for the site in the address bar, or for something embedded inside it?

## The storage mechanisms

- **Cookies** are small name–value pairs that the browser sends back to the server with matching requests. That is why logins rely on them. Attributes such as \`Secure\`, \`HttpOnly\` and \`SameSite\` control when a cookie is sent and whether scripts can read it.
- **localStorage** holds strings that persist until cleared. **sessionStorage** holds strings for one tab and forgets them when it closes. Neither is sent to the server automatically.
- **IndexedDB** is a transactional database in the browser, used by web apps that work offline or handle large amounts of data.
- **Cache Storage** lets service workers keep copies of network responses.

All of them are scoped to an origin: the scheme, host and port of the site that wrote them.

## First-party and third-party contexts

When you visit \`news.example\`, that site is the **first party**. If the page embeds a video player, an ad, or a "like" button from another domain, those embeds run in a **third-party** context. They can try to store data too.

Third-party storage is what made cross-site tracking easy. An ad server embedded on thousands of sites could set one cookie, see it on every one of those sites, and build a browsing history. Browsers have since taken three different paths.

## How the major browsers differ

**Safari** has blocked third-party cookies by default since Safari 13.1 and iOS 13.4 (March 2020).

**Firefox** uses State Partitioning, on by default since Firefox 103. Third-party storage still works, but it is double-keyed: by the embedded site and by the top-level site. The same embedded player on two different sites gets two separate, unconnected cookie jars. Firefox also partitions network state such as the HTTP cache.

**Chrome** still allows third-party cookies by default. Google had planned to phase them out, but in April 2025 announced it would keep its current approach of letting users choose in Chrome's privacy settings, and would not introduce a separate prompt.

Two newer mechanisms bridge these approaches:

- **Partitioned cookies (CHIPS).** A cookie set with the \`Partitioned\` attribute is stored per top-level site by design. That suits embedded chat widgets or maps that need state but shouldn't track across sites. It became Baseline across major browsers in 2025.
- **The Storage Access API.** An embedded iframe can ask for access to its unpartitioned cookies, usually after you interact with it and sometimes with a prompt. This is how "log in with" widgets keep working under strict defaults.

## How much can a site store?

Quotas are generous but not unlimited. MDN documents that Chromium-based browsers let an origin use up to about 60% of the disk. Firefox allows the smaller of 10% of the disk or 10 GiB per group of sites in its default "best-effort" mode. Data in best-effort mode can be evicted when the device runs low on space. A site can ask for persistent storage, which the browser then only clears on your request.

## Private windows

Private and incognito windows start with empty storage and discard all of it when they close. Sites can still store data during the session, which is why your login works until you close the window.

## When a site keeps forgetting you

1. Check that the site's first-party cookies aren't blocked. The [cookies and storage test](/tools/cookies-test) shows which mechanisms work on BrowserProbe, and your browser's site settings show per-site rules.
2. If a login inside an embedded widget fails, the widget may need third-party storage. Allowing it for that one site is safer than turning protections off everywhere.
3. Extensions that block trackers sometimes block storage on sites you use. Try a window without extensions to find out.`,
    sources: [
      { title: "WebKit: Full Third-Party Cookie Blocking and More (March 2020)", url: "https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/" },
      { title: "MDN: State Partitioning", url: "https://developer.mozilla.org/en-US/docs/Web/Privacy/Guides/State_Partitioning" },
      { title: "Privacy Sandbox: Next steps for Privacy Sandbox and tracking protections in Chrome", url: "https://privacysandbox.google.com/blog/privacy-sandbox-next-steps" },
      { title: "MDN: Cookies Having Independent Partitioned State (CHIPS)", url: "https://developer.mozilla.org/en-US/docs/Web/Privacy/Guides/Privacy_sandbox/Partitioned_cookies" },
      { title: "MDN: Storage Access API", url: "https://developer.mozilla.org/en-US/docs/Web/API/Storage_Access_API" },
      { title: "MDN: Storage quotas and eviction criteria", url: "https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria" },
    ],
  },
  {
    slug: "ip-address-explained",
    title: "What Your IP Address Reveals: IPv4, IPv6, NAT and VPNs Explained",
    excerpt: "What an IP address actually identifies, why you may have several, how NAT, carrier-grade NAT and IPv6 privacy addresses change the picture, and what a VPN hides.",
    date: "2026-10-23",
    updated: "2026-10-23",
    readTime: "8 min read",
    category: "Network",
    relatedTool: "what-is-my-ip",
    content: `"What is my IP address?" is one of the most searched questions on the web. The answer is less simple than one number suggests. Your device usually has several addresses, websites see a different one again, and that address may be shared with thousands of other people.

## What an IP address identifies

An IP address is a routing label: it tells the network where to deliver packets. When your browser loads a page, the server sees the address the connection came from, the **public address**. That address belongs to whoever runs the last hop before the internet. That is your home router (provided by your ISP), your mobile carrier, your workplace network or your VPN.

So an IP address identifies a network connection at a point in time, not a person and not usually a device.

## IPv4 and IPv6

**IPv4** addresses are 32-bit numbers written as four decimal parts, such as \`203.0.113.7\`. There are only about four billion of them, far fewer than devices online.

**IPv6** addresses are 128-bit numbers written in hexadecimal groups, such as \`2001:db8:85a3::8a2e:370:7334\`. There are so many that every device can have its own globally routable address.

Many connections are **dual-stack** and have both. Browsers usually try IPv6 and IPv4 in parallel and use whichever connects first. So whether a website sees your IPv4 or IPv6 address can vary between visits, and a single request only ever reveals one of them.

## NAT: many devices, one address

Because IPv4 addresses are scarce, home routers use **network address translation** (NAT). Devices on your network get private addresses from reserved ranges, such as \`192.168.0.0/16\` or \`10.0.0.0/8\`, and the router translates their traffic to its single public address. Everyone in your household appears to websites as the same IP.

Mobile carriers and some broadband providers add a second layer: **carrier-grade NAT** (CGNAT). Your router or phone gets an address from \`100.64.0.0/10\`, a block RFC 6598 reserves as "shared address space" that is not globally routable. The carrier then translates thousands of customers to a smaller pool of public addresses. In that case your public IP is shared with strangers, and IP-based blocking or geolocation becomes much less precise.

## IPv6 privacy addresses

With IPv6 there is no shortage, so NAT is rarely needed, and each device gets its own public address. To stop that address from becoming a long-term identifier, operating systems generate **temporary addresses** with randomized interface identifiers. RFC 8981 describes them, with a default preferred lifetime of one day and a valid lifetime of two days. Your IPv6 address therefore changes regularly, even if the network prefix assigned by your ISP stays the same.

## How accurate is IP geolocation?

IP location comes from databases that map address blocks to places, built from registration records, ISP data and measurements. Country is usually right. City is often approximate, and for mobile networks, satellite connections, CGNAT and VPNs it can be wrong by hundreds of kilometres. An IP address alone does not give anyone your street address. That takes records from the ISP, which normally requires a legal process.

## What a VPN changes

A VPN sends your traffic through an encrypted tunnel to a server, and websites see the VPN server's address instead of your ISP's. It does not change your browser's time zone, language or fingerprint, and the VPN provider can see the same metadata your ISP used to.

One known gap is **WebRTC**. If a VPN doesn't route WebRTC's STUN traffic, a page can discover your real public address through it. The [WebRTC leak test](/tools/webrtc-leak-test) checks for that.

## Reading BrowserProbe's result

The [IP address test](/tools/what-is-my-ip) shows the one address your request arrived from, its family (IPv4 or IPv6), and whether it is public or falls in a special-purpose range, as defined by IANA's registries. It also shows the approximate location our host's database gives it. The address isn't stored by the application.`,
    sources: [
      { title: "IANA IPv4 Special-Purpose Address Registry", url: "https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry.xhtml" },
      { title: "IANA IPv6 Special-Purpose Address Registry", url: "https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry.xhtml" },
      { title: "RFC 6598: IANA-Reserved IPv4 Prefix for Shared Address Space", url: "https://www.rfc-editor.org/rfc/rfc6598.html" },
      { title: "RFC 8981: Temporary Address Extensions for Stateless Address Autoconfiguration in IPv6", url: "https://www.rfc-editor.org/rfc/rfc8981.html" },
      { title: "RFC 8828: WebRTC IP Address Handling Requirements", url: "https://www.rfc-editor.org/rfc/rfc8828.html" },
    ],
  },
  {
    slug: "webgl-webgpu-gpu-fingerprinting",
    title: "What Your Graphics Card Reveals Through WebGL and WebGPU",
    excerpt: "Why browsers expose GPU details at all, how renderer strings differ between Chrome, Firefox and Safari, what WebGPU adds, and how each browser limits it.",
    date: "2026-10-23",
    updated: "2026-10-23",
    readTime: "7 min read",
    category: "Fingerprinting",
    relatedTool: "webgl-info",
    content: `Modern web pages can use the graphics processor directly, through WebGL and its successor WebGPU. That powers 3D maps, games, product configurators and machine-learning demos. It also means a page can learn something about the graphics hardware, which is one of the more identifying things a browser exposes.

## Why the GPU is visible at all

Graphics drivers have bugs, and some bugs only appear on specific chips or driver versions. Developers of serious WebGL applications need to know what they are running on, so they can avoid broken features or choose a lighter rendering path. Both APIs therefore offer a way to ask "which GPU is this?", and browsers have to balance that need against fingerprinting.

## WebGL renderer strings

WebGL has two layers of identification:

- The standard \`RENDERER\` and \`VENDOR\` parameters.
- The \`WEBGL_debug_renderer_info\` extension, which adds "unmasked" versions of both.

How browsers fill them differs:

- **Chromium browsers** return placeholders ("WebKit WebGL") from the standard parameters and the real driver string from the extension. The string typically looks like \`ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0, D3D11)\`. ANGLE is the layer that translates WebGL onto Direct3D, Metal or Vulkan.
- **Safari** reports a generic "Apple GPU" rather than the exact chip.
- **Firefox** returns a sanitized renderer string, and marks the debug extension as deprecated. With \`privacy.resistFingerprinting\` enabled, the extension is disabled.

Beyond the strings, WebGL exposes dozens of capability values: maximum texture size, maximum viewport, supported shader precision, and the list of extensions. Their combination varies by GPU and driver. A page can also render a scene and read the pixels back, the same way canvas fingerprinting works.

## What WebGPU adds

WebGPU exposes an **adapter**, the browser's handle to a physical or software GPU, with an \`info\` object containing vendor, architecture, device and description strings. MDN notes that this information is deliberately minimal, that browsers are likely to share different types and granularities of it, and that each field may be an empty string.

WebGPU support is still uneven:

- **Chrome and Edge:** available on desktop since version 113 (ChromeOS, macOS and Windows), with Linux support for some GPUs since version 144.
- **Safari:** available from version 26.
- **Firefox:** enabled on Windows since version 141.

## Software rendering and virtual machines

When hardware acceleration is off, or the browser runs in a virtual machine, WebGL falls back to a software renderer such as SwiftShader or llvmpipe. The renderer string says so. That is a strong hint about the environment, which is why automated browsers and bots often stand out here.

## How identifying is it?

A mainstream integrated GPU in a popular laptop is shared by millions of people. A specific high-end or workstation card, or an unusual driver version, narrows things much further. On its own, the GPU string separates groups; combined with screen size, fonts and time zone, it contributes strongly to a fingerprint.

## What limits it

- **Use a browser that generalizes these strings.** Safari and Firefox coarsen them by default. Brave adds randomization to several graphics-related outputs.
- **Avoid spoofing extensions.** A desktop GPU string next to a mobile user agent is a contradiction trackers can spot.
- **Keep hardware acceleration on** unless you have a reason to switch it off. A software renderer is rarer than a common GPU.

The [WebGL and WebGPU test](/tools/webgl-info) shows exactly what your browser reveals, and which path the renderer string came from.`,
    sources: [
      { title: "MDN: WEBGL_debug_renderer_info", url: "https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_debug_renderer_info" },
      { title: "MDN: GPUAdapterInfo", url: "https://developer.mozilla.org/en-US/docs/Web/API/GPUAdapterInfo" },
      { title: "MDN: WebGPU API", url: "https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API" },
      { title: "W3C Group Note: Mitigating Browser Fingerprinting in Web Specifications", url: "https://www.w3.org/TR/fingerprinting-guidance/" },
    ],
  },
  {
    slug: "screen-viewport-device-pixel-ratio",
    title: "Screen Resolution, Viewport and Device Pixel Ratio Explained",
    excerpt: "Why a 4K monitor can report 1920 pixels, what CSS pixels are, how zoom and display scaling change every number, and which value responsive layouts actually use.",
    date: "2026-10-23",
    updated: "2026-10-23",
    readTime: "6 min read",
    category: "Browser & display",
    relatedTool: "screen-resolution",
    content: `Ask a browser how big your screen is and you might get an answer that looks wrong. A 4K monitor reports 1920 pixels across, and a phone with a 1179-pixel-wide panel reports 393. Neither is a mistake. Browsers measure in **CSS pixels**, and knowing how those relate to physical pixels explains almost every surprising number.

## CSS pixels and physical pixels

A CSS pixel is the unit web pages use for layout. On a classic desktop display, one CSS pixel is one physical pixel. High-density displays pack more physical pixels into the same space, so the browser draws each CSS pixel with several physical ones. Text and images get sharper, and the layout stays the same size.

The ratio between the two is \`window.devicePixelRatio\`. MDN describes it as the ratio of the resolution in physical pixels to the resolution in CSS pixels, with 1 meaning a classic 96-DPI display and 2 expected for HiDPI or "Retina" displays. Phones commonly report 3.

## The sizes a page can read

- \`screen.width\` and \`screen.height\` give the whole display, in CSS pixels.
- \`screen.availWidth\` and \`availHeight\` give the display minus permanent system UI, such as the taskbar or dock.
- \`window.outerWidth\` and \`outerHeight\` give the browser window, including its toolbars.
- \`window.innerWidth\` and \`innerHeight\` give the viewport, the area showing the page, including the scrollbar.
- \`window.visualViewport\` gives the part visible right now, which shrinks when you pinch-zoom or an on-screen keyboard opens.

Responsive layouts use the viewport. CSS media queries such as \`(max-width: 600px)\` test the viewport width, not the screen.

## Display scaling and zoom

Operating-system scaling changes the CSS-pixel numbers for the whole screen. A 2560-pixel-wide monitor at 150% scaling has a device pixel ratio of 1.5, and reports a screen width of about 1707 CSS pixels.

Browser zoom does the same thing for one site. MDN notes that page zoom increases the size of a CSS pixel, so \`devicePixelRatio\` rises and the viewport, measured in CSS pixels, shrinks. Pinch-zoom is different: it magnifies the page without changing CSS pixels, so it changes the visual viewport instead.

## Why developers care

- **Sharp graphics:** a \`<canvas>\` sized 200 × 200 CSS pixels needs 400 × 400 actual pixels on a ratio-2 screen, or it looks blurry. MDN's canvas example multiplies the drawing buffer by \`devicePixelRatio\` for exactly this reason.
- **Responsive images:** \`srcset\` lets the browser pick a higher-resolution image on denser screens.
- **Layout bugs:** a design that works at 100% zoom can break at 125%, because the viewport is 20% narrower in CSS pixels.

## Why privacy researchers care

Screen and window sizes are classic fingerprinting signals. Common laptop resolutions are shared by millions of people. An unusual combination of screen size, window size, scaling and zoom can be rare, and the window size changes every time you resize it. Tor Browser rounds the window to standard sizes ("letterboxing") so that its users look alike. Firefox's fingerprinting protection adjusts the available-screen values when it is active.

## See your own numbers

The [screen resolution test](/tools/screen-resolution) shows every one of these values side by side, updates them live as you resize or zoom, and estimates the physical resolution from the device pixel ratio.`,
    sources: [
      { title: "MDN: Window.devicePixelRatio", url: "https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio" },
      { title: "MDN: Visual Viewport API", url: "https://developer.mozilla.org/en-US/docs/Web/API/Visual_Viewport_API" },
      { title: "MDN: color-gamut media feature", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/color-gamut" },
      { title: "W3C Group Note: Mitigating Browser Fingerprinting in Web Specifications", url: "https://www.w3.org/TR/fingerprinting-guidance/" },
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
