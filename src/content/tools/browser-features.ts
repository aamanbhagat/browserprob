import type { ToolContent } from "@/content/types";

const content: ToolContent = {
  sections: [
    {
      id: "measures",
      heading: "What this test checks",
      body: `This page checks whether 33 web platform APIs exist in your browser. They range from long-established ones such as WebSocket, IndexedDB and Web Workers, to newer ones such as WebGPU, View Transitions and the File System Access pickers, and hardware APIs such as Web Bluetooth and WebUSB that only some browsers offer.

For a few APIs, the page adds a note on why "present" may not mean "usable here". Some need your permission, some only work on cross-origin isolated pages, and some are switched off on this site by its own security policy.`,
    },
    {
      id: "how-it-works",
      heading: "How the test works",
      body: `Each check looks for the API's entry point, for example \`"serviceWorker" in navigator\`, \`typeof WebAssembly\`, or whether a canvas can create a \`webgl2\` context. No API is actually used, and nothing triggers a permission prompt.

This site sends a \`Permissions-Policy\` header that disables geolocation, payment, USB and Bluetooth on its own pages, because no BrowserProbe test needs them. The page marks those four features accordingly. \`SharedArrayBuffer\` is only exposed on pages that opt into cross-origin isolation (COOP and COEP headers). BrowserProbe does not, so "Missing" there describes this site, not your browser.`,
    },
    {
      id: "reading",
      heading: "How to read your result",
      body: `**Present** means the browser exposes the API. **Missing** means it does not, on this page, at this moment.

Missing hardware APIs are expected in some browsers. Firefox and Safari have chosen not to ship Web Bluetooth, WebUSB or the Battery Status API, citing privacy and security concerns. The File System Access pickers are Chromium-only. A browser that lacks these isn't broken; it just won't run web apps that depend on them.

The count at the top is a convenience. A higher number is not a better score, and every API you have adds a little to what a page can learn about your browser.`,
    },
    {
      id: "limitations",
      heading: "What feature detection can't show",
      body: `An API can exist and still fail at runtime. It may need a secure (HTTPS) context, a user gesture, a permission, specific hardware, or a policy that allows it. Embedded frames can also be restricted by the page that embeds them.

Conversely, an extension or polyfill can add an object that only looks like the real API. To be sure an API works for a given web app, the app itself has to try it.`,
    },
    {
      id: "fixes",
      heading: "If a site needs an API you don't have",
      body: `- **Update the browser first.** New APIs arrive with every release.
- **Check the site's requirements.** Tools that program microcontrollers or talk to Bluetooth devices often need a Chromium-based browser for WebUSB or Web Bluetooth.
- **Check permissions.** Notifications, clipboard access and device APIs can be blocked per site in your browser's site settings.
- **Hardware acceleration** must be on for WebGL and WebGPU. The [WebGL test](/tools/webgl-info) helps with that.`,
    },
  ],
  faq: [
    {
      question: "What is browser feature detection?",
      answer: "It is checking whether an API exists before using it, instead of guessing from the browser's name. Feature detection is more reliable than reading the user-agent string, because it tests what the browser actually provides.",
    },
    {
      question: "Why don't Firefox and Safari support WebUSB or Web Bluetooth?",
      answer: "Both vendors have declined to implement them, citing the security and privacy risks of giving web pages direct access to hardware. Chromium-based browsers ship them behind permission prompts.",
    },
    {
      question: "Why does SharedArrayBuffer show as missing?",
      answer: "Browsers only expose it on pages that are cross-origin isolated, which requires the COOP and COEP headers. BrowserProbe does not send COEP, so the API is unavailable here even if your browser supports it.",
    },
  ],
  sources: [
    { title: "MDN: Permissions-Policy header", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Permissions-Policy" },
    { title: "MDN: SharedArrayBuffer (security requirements)", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer" },
    { title: "MDN: Secure contexts", url: "https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts" },
  ],
};

export default content;
