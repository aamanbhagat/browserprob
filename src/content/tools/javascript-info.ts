import type { ToolContent } from "@/content/types";

const content: ToolContent = {
  sections: [
    {
      id: "measures",
      heading: "What this test answers",
      body: `First, the basic question: does JavaScript run in this browser on this site? Second, which modern JavaScript built-ins are available, grouped by the edition of the ECMAScript standard that introduced them, from ES2015 to ES2025, plus two internationalisation APIs.

Many sites stop working without JavaScript: logins, maps, shops and most web apps. When a site says "please enable JavaScript", this page tells you whether that is really the cause.`,
    },
    {
      id: "how-it-works",
      heading: "How the test works",
      body: `The answer is built into the page in two layers:

- **Server-rendered first layer:** if JavaScript is off, the browser displays the "No" message directly from the HTML. If it is on but blocked, the "Checking whether JavaScript runs…" note stays on screen.
- **Second layer:** as soon as the page's script runs, it replaces those messages with a "Yes", written by JavaScript itself.

For the feature list, the script checks whether specific built-in objects and methods exist, for example \`Array.prototype.at\` (ES2022), \`Promise.withResolvers\` (ES2024) and the new \`Set\` methods (ES2025). Syntax features such as optional chaining can't be checked this way without \`eval\`, which this site's security policy forbids. If the page runs at all, your browser has already parsed modern syntax.`,
    },
    {
      id: "reading",
      heading: "How to read your result",
      body: `**"Yes, JavaScript is enabled"** confirms that scripts run on this site. If another site claims JavaScript is off, that site's scripts are probably being blocked specifically, by an extension, a content blocker, or a per-site setting.

**"Everything listed up to ES20xx is available"** gives the newest edition for which every listed feature exists. Browsers kept up to date normally support everything through ES2023 or later. Gaps in the newest editions are common, because browsers ship features at different times.

A **"No"** next to an older feature points to an outdated browser, or to a restricted environment such as an embedded webview in an old app.`,
    },
    {
      id: "limitations",
      heading: "Limits of feature detection",
      body: `Feature checks confirm that a function exists, not that it behaves correctly in every edge case. They also can't tell apart "turned off" and "removed by an extension", and polyfills loaded by a page can make a missing feature look present.

The list covers a sample of notable additions to the standard, not every method. If a specific site fails, its own error message in the browser's developer console is the more precise clue.`,
    },
    {
      id: "fixes",
      heading: "How to turn JavaScript on",
      body: `- **Chrome and Edge:** Settings → Privacy and security → Site settings → JavaScript → "Sites can use JavaScript", or allow it for a specific site.
- **Firefox:** JavaScript is controlled by \`javascript.enabled\` in \`about:config\`. If it is off, set it to \`true\`. Extensions such as NoScript also block it per site.
- **Safari (macOS):** Settings → Security → "Enable JavaScript". On iPhone and iPad, it is under Settings → Apps → Safari → Advanced.

If JavaScript is on but features are missing, update your browser. Its version is shown on the [What Is My Browser page](/tools/what-is-my-browser).`,
    },
  ],
  faq: [
    {
      question: "How do I know if JavaScript is enabled?",
      answer: "Open this page: if JavaScript runs, the result says so in green, written by a script. If you only see the server-rendered \"No\" or \"Checking\" message, scripts are off or blocked for this site.",
    },
    {
      question: "Is it safer to disable JavaScript?",
      answer: "It removes a large attack and tracking surface, which is why some high-security setups do it, but most modern sites stop working. Blocking scripts selectively per site is a more practical middle ground.",
    },
    {
      question: "What is ECMAScript?",
      answer: "ECMAScript is the official standard behind JavaScript, published by Ecma International with a new edition every year. ES2015 introduced classes, modules and promises; later editions add smaller features.",
    },
  ],
  sources: [
    { title: "Ecma International: ECMA-262 (ECMAScript language specification)", url: "https://ecma-international.org/publications-and-standards/standards/ecma-262/" },
    { title: "MDN: JavaScript reference", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference" },
    { title: "MDN: <noscript>", url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/noscript" },
  ],
};

export default content;
