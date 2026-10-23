import type { ToolContent } from "@/content/types";

const content: ToolContent = {
  sections: [
    {
      id: "measures",
      heading: "What this test reads",
      body: `This page reads the identity your browser announces about itself. That is the same information it sends to every website in the \`User-Agent\` request header, plus a few related JavaScript properties:

- \`navigator.userAgent\`: the full user-agent string.
- \`navigator.userAgentData\`: the brand list, platform and mobile flag from User-Agent Client Hints, in Chromium-based browsers only.
- \`navigator.vendor\` and \`navigator.platform\`: older properties that are kept for compatibility.
- \`navigator.languages\`: your preferred languages, in order.

Nothing is sent to BrowserProbe's server for this test. The values are read and parsed inside your tab.`,
    },
    {
      id: "how-it-works",
      heading: "How the browser is identified",
      body: `If the browser offers Client Hints, the name and version come from its brand list. The test ignores the generic "Chromium" entry and the deliberately meaningless GREASE brand (such as "Not)A;Brand"). Otherwise the user-agent string is matched against known browser tokens in a fixed order. The order matters because user-agent strings borrow from each other: Microsoft Edge's string also contains "Chrome" and "Safari", and Chrome's contains "Safari", so the more specific tokens (\`Edg/\`, \`OPR/\`, \`SamsungBrowser/\`) are checked before the generic ones.

The rendering engine is inferred from the same string. \`AppleWebKit\` without a Chromium token means WebKit. \`Gecko\` together with \`Firefox\` means Gecko, and any Chromium-family token means Blink. Chrome, Edge and Firefox apps on iOS (\`CriOS\`, \`EdgiOS\`, \`FxiOS\`) are reported as WebKit, because that is the engine those apps have used on Apple's platform.`,
    },
    {
      id: "reading",
      heading: "How to read your result",
      body: `**Browser** and **Version** are the best available answer. In Chromium browsers the version from Client Hints is the major version only, such as "143".

**Name in user-agent string** only appears when the user-agent string disagrees with Client Hints. That happens with browsers that copy Chrome's string, and with headless or automated browsers.

**Rendering engine** tells you which code actually draws the page. That is what decides how web features behave, more than the brand on the icon.

**navigator.vendor** is a legacy value: "Google Inc." in Chromium browsers, "Apple Computer, Inc." in Safari, and empty in Firefox. It does not identify the company behind your particular browser.

**User-agent string** is printed in full, so you can copy it into a bug report. Underneath it, the page lists the parts of the string your browser has frozen or reduced.`,
    },
    {
      id: "limitations",
      heading: "What the user-agent string can't tell you",
      body: `User-agent strings stopped being precise years ago, and the reduction is deliberate. Chromium-based browsers now report a fixed operating-system token, such as \`Macintosh; Intel Mac OS X 10_15_7\` on every Mac or \`Windows NT 10.0; Win64; x64\` on both Windows 10 and Windows 11. They also replace the minor version with \`0.0.0\`. On Android they show \`Android 10; K\` instead of the real version and device model. Safari also freezes the macOS version. An Apple-silicon Mac still says "Intel", because that token is frozen too.

The string is also easy to change. Developer tools, extensions and some privacy browsers rewrite it, and a few browsers present Chrome's string unchanged. Treat this page as "what your browser claims", not as proof of the software or device behind it. For the details Chromium browsers still share on request, such as the real platform version, see the [Client Hints test](/tools/client-hints).`,
    },
    {
      id: "fixes",
      heading: "Updating or changing what your browser reports",
      body: `If a site says your browser is out of date, update it from the browser itself rather than from a download link on that site:

- **Chrome:** Settings → About Chrome.
- **Edge:** Settings → About Microsoft Edge.
- **Firefox:** Settings → General → Firefox Updates.
- **Safari:** comes with macOS and iOS updates.

Changing the user-agent string is possible in developer tools: Chrome and Edge have it under Network conditions, and Firefox has it in responsive design mode. That is useful for testing a site. It is rarely a good privacy measure. A rare or inconsistent string, such as a mobile string with a desktop screen size, makes a browser easier to tell apart, not harder.`,
    },
  ],
  faq: [
    {
      question: "Why does my browser say Windows NT 10.0 when I use Windows 11?",
      answer: "Browsers stopped updating that token, so Windows 10 and Windows 11 send the same value. In Chromium browsers the real release is only available through the Client Hints platform version, which is 13 or higher on Windows 11.",
    },
    {
      question: "Why does Chrome's version number end in .0.0.0?",
      answer: "Chrome reduces its user-agent string to the major version and replaces the build and patch numbers with zeros. The full version is still available to sites that request it through User-Agent Client Hints.",
    },
    {
      question: "Can I stop my browser from sending a user agent?",
      answer: "No. Every browser sends a User-Agent header, and HTTP clients without one are often blocked. You can change the value in developer tools or with an extension, but an unusual value tends to make your browser stand out.",
    },
    {
      question: "What is the difference between a browser and its rendering engine?",
      answer: "The browser is the application you install; the engine is the component that turns HTML, CSS and JavaScript into pixels. Chrome, Edge, Opera and Brave share the Blink engine, Firefox uses Gecko, and Safari uses WebKit.",
    },
  ],
  sources: [
    { title: "MDN: User-Agent reduction", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/User-agent_reduction" },
    { title: "Chrome for Developers: User-Agent Client Hints", url: "https://developer.chrome.com/docs/privacy-security/user-agent-client-hints" },
    { title: "Microsoft Learn: Detect Windows 11 using User-Agent Client Hints", url: "https://learn.microsoft.com/en-us/microsoft-edge/web-platform/how-to-detect-win11" },
  ],
};

export default content;
