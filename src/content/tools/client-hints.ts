import type { ToolContent } from "@/content/types";

const content: ToolContent = {
  sections: [
    {
      id: "measures",
      heading: "What this test reads",
      body: `User-Agent Client Hints split the information that used to be packed into the user-agent string into separate, named values. This page reads them through \`navigator.userAgentData\` in two groups:

- **Low-entropy hints:** the brand list (browser names and major versions), whether the device is mobile, and the platform name. Supporting browsers send these with every request as the \`Sec-CH-UA\`, \`Sec-CH-UA-Mobile\` and \`Sec-CH-UA-Platform\` headers, and any page can read them.
- **High-entropy hints:** CPU architecture, bitness, form factors, the full version of every brand, device model, platform version, and whether a 32-bit app runs on 64-bit Windows (WoW64). These are only returned when a page asks for them with \`getHighEntropyValues()\`. A server can ask for them with the \`Accept-CH\` response header.`,
    },
    {
      id: "how-it-works",
      heading: "How the test works",
      body: `The page calls \`navigator.userAgentData.getHighEntropyValues()\` for all seven high-entropy hints at once and displays whatever comes back. It does not guess at missing values. If a value comes back empty, or the browser refuses the request, it appears in the "withheld" list instead. GREASE brands are removed from the brand list before display. The specification requires browsers to include an arbitrary brand, so sites cannot rely on an exact list.

If the platform is Windows, the page also interprets the platform version. Microsoft documents that a major version of 1 to 10 means Windows 10, and 13 or higher means Windows 11. The user-agent string can no longer tell these apart.`,
    },
    {
      id: "reading",
      heading: "How to read your result",
      body: `**Brands** usually lists the browser and "Chromium" with major versions, such as "Google Chrome 143, Chromium 143". Browsers built on Chromium can put their own name here even when their user-agent string is identical to Chrome's.

**Platform** and **Platform version** describe the operating system. Unlike the frozen user-agent string, the platform version is real: for example "15.1.0" on macOS 15.1.

**CPU architecture** and **Bitness** (for example "arm" and "64") let download pages offer the right installer.

**Device model** is normally empty on desktop computers. On Android it can name the phone model, which is one reason Chromium treats it as high entropy.

**Full version list** shows exact build numbers, the detail removed from the reduced user-agent string.`,
    },
    {
      id: "limitations",
      heading: "Who supports Client Hints",
      body: `Only Chromium-based browsers (Chrome, Edge, Opera, Samsung Internet and others) implement User-Agent Client Hints. Firefox and Safari do not, so this page reports them as not supported there. Those browsers rely on their user-agent string alone.

The specification is a W3C Community Group draft, not a W3C Standard, and browsers decide for themselves which values to return. From Chrome 144, a site's Permissions-Policy can also stop its pages, or frames embedded in them, from receiving the high-entropy values. As with any self-reported value, an extension or a modified browser can return whatever it likes.`,
    },
    {
      id: "fixes",
      heading: "Can you limit what Client Hints reveal?",
      body: `There is no built-in setting in Chrome or Edge that switches Client Hints off. The low-entropy values replace information the user-agent string already carried, and the detailed ones are only returned on request. Using Firefox or Safari avoids the API entirely.

Browsers with fingerprinting defenses may reduce or fix some values. Overriding Client Hints with an extension tends to create a combination that matches no real browser, which makes you easier, not harder, to distinguish.`,
    },
  ],
  faq: [
    {
      question: "Why do I see a brand like \"Not)A;Brand\"?",
      answer: "That is GREASE: Chromium adds an intentionally odd extra brand so that websites do not depend on an exact brand list. It carries no information, so BrowserProbe hides it.",
    },
    {
      question: "Is my device model really empty?",
      answer: "On desktop computers, yes: Chromium returns an empty string for the model. On Android phones the model hint can contain the device name.",
    },
    {
      question: "How can a site tell Windows 11 from Windows 10?",
      answer: "Only through the platform version Client Hint. Microsoft documents that a major platform version of 13 or higher means Windows 11; the user-agent string reports Windows NT 10.0 for both.",
    },
  ],
  sources: [
    { title: "WICG: User-Agent Client Hints (Draft Community Group Report)", url: "https://wicg.github.io/ua-client-hints/" },
    { title: "Chrome for Developers: User-Agent Client Hints", url: "https://developer.chrome.com/docs/privacy-security/user-agent-client-hints" },
    { title: "Microsoft Learn: Detect Windows 11 and CPU architecture using User-Agent Client Hints", url: "https://learn.microsoft.com/en-us/microsoft-edge/web-platform/how-to-detect-win11" },
    { title: "MDN: NavigatorUAData.getHighEntropyValues()", url: "https://developer.mozilla.org/en-US/docs/Web/API/NavigatorUAData/getHighEntropyValues" },
  ],
};

export default content;
