import type { ToolContent } from "@/content/types";

const content: ToolContent = {
  sections: [
    {
      id: "measures",
      heading: "What this test reads",
      body: `This page reads three related values:

- **\`navigator.plugins\`:** the browser's plugin list. It once showed Flash, Java and other installed plugins.
- **\`navigator.mimeTypes\`:** the file types those plugins handle.
- **\`navigator.pdfViewerEnabled\`:** whether the browser can show PDF files inline.

It also tells you whether your browser returned the standard list that every current browser is required to return, or something different.`,
    },
    {
      id: "how-it-works",
      heading: "Why the list is fixed today",
      body: `Browser plugins (NPAPI and similar) were removed years ago. To stop the old plugin list from being a fingerprinting signal, the HTML standard now hard-codes it.

If the browser can display PDFs inline, \`navigator.plugins\` returns exactly five entries: "PDF Viewer", "Chrome PDF Viewer", "Chromium PDF Viewer", "Microsoft Edge PDF Viewer" and "WebKit built-in PDF". The MIME types are \`application/pdf\` and \`text/pdf\`. If it can't, both lists are empty. These names exist only because old sites check for them; they don't mean you have Chrome or Edge installed.

The page compares your list with those five names and classifies it as the standard list, empty, or non-standard.`,
    },
    {
      id: "reading",
      heading: "How to read your result",
      body: `- **"The standard five-entry PDF list"** is what Chrome, Edge, Firefox and Safari return when inline PDF viewing is on. It carries no information about you beyond "this browser can show PDFs".
- **"An empty list"** appears when inline PDF viewing is unavailable, for example in headless and kiosk browsers, or when a browser is set to download PDFs. Firefox is an exception: it reports \`pdfViewerEnabled\` as true even when set to open PDFs in another application.
- **"A non-standard list"** points to an old browser version or a modified browser. That makes the list a more distinctive signal again.`,
    },
    {
      id: "limitations",
      heading: "This test cannot see your extensions",
      body: `Browser **extensions** (ad blockers, password managers, translators) are not plugins and never appear in \`navigator.plugins\`. No web API lists them.

Sites can sometimes infer that an extension is present: from changes it makes to the page, requests it blocks, or files it exposes to web pages. That is a different and less reliable technique, and this page does not attempt it. Any site that claims to list "all your installed extensions" is guessing from such side effects.`,
    },
    {
      id: "fixes",
      heading: "Changing how PDFs open",
      body: `- **Chrome and Edge:** Settings → Privacy and security → Site settings → Additional content settings → PDF documents. Choose between opening PDFs in the browser and downloading them.
- **Firefox:** Settings → General → Applications → Portable Document Format.
- **Safari** opens PDFs inline by default.

None of these settings affects your fingerprint much, because the plugin list is fixed either way.`,
    },
  ],
  faq: [
    {
      question: "Can websites see all my browser extensions?",
      answer: "No. There is no API that lists extensions. Sites can only guess at some of them from side effects, such as page changes or blocked requests.",
    },
    {
      question: "Why does my browser list a \"Microsoft Edge PDF Viewer\" when I use Firefox?",
      answer: "The HTML standard requires every browser with an inline PDF viewer to return the same five plugin names, so old sites that check for them keep working. The names do not mean those products are installed.",
    },
    {
      question: "Does navigator.plugins still matter for fingerprinting?",
      answer: "Much less than it used to. Current browsers all return the same list or an empty one, so it only reveals whether inline PDF viewing is on, unless the browser is outdated or modified.",
    },
  ],
  sources: [
    { title: "MDN: Navigator.plugins", url: "https://developer.mozilla.org/en-US/docs/Web/API/Navigator/plugins" },
    { title: "MDN: Navigator.pdfViewerEnabled", url: "https://developer.mozilla.org/en-US/docs/Web/API/Navigator/pdfViewerEnabled" },
  ],
};

export default content;
