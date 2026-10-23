import type { ToolContent } from "@/content/types";

const content: ToolContent = {
  sections: [
    {
      id: "measures",
      heading: "What canvas fingerprinting is",
      body: `The HTML \`<canvas>\` element lets scripts draw shapes and text and then read the resulting pixels back. When two browsers draw the same thing, the pixels are not always identical. Font rendering, anti-aliasing, the graphics driver and the operating system's text engine all leave small differences. A tracking script can draw a fixed image, read it back and reduce it to a short ID. That ID becomes one signal among many for recognizing a browser without cookies.

This test performs exactly that drawing and shows you the result, so you can see what a site would get and whether your browser interferes.`,
    },
    {
      id: "how-it-works",
      heading: "How the test works",
      body: `The page creates a hidden 280 × 60 canvas and draws:

- a background;
- the text "BrowserProbe 🌐" in Arial;
- "Canvas Fingerprint Test" in Georgia;
- a semi-transparent circle and a Bézier curve.

It reads the image back with \`toDataURL()\` and turns it into a 16-character sample ID with a fast non-cryptographic hash (two FNV-1a passes).

It then does the same drawing a second time and compares the two reads. It also compares the first read with an empty canvas of the same size, to detect browsers that return a blank image. The drawing and the hash never leave your tab.`,
    },
    {
      id: "reading",
      heading: "How to read your result",
      body: `- **"Both reads returned the same image":** your browser renders this drawing consistently, so a site could use the ID as a stable signal. That is the normal result in most browsers. Thousands of other people with the same browser version, operating system and graphics hardware get the identical ID.
- **"The two reads differ":** your browser added noise between two identical drawings. That is a deliberate defense: a site cannot rely on the value staying the same.
- **"The browser returned a blank image":** canvas readback was blocked or replaced with an empty image, so the signal carries no information.

The preview shows the image exactly as your browser drew it.`,
    },
    {
      id: "limitations",
      heading: "Limits and false conclusions",
      body: `A sample ID is not a personal identifier. Population data would be needed to say how rare a particular ID is, and one visit to one site can't provide that. Treat any website that claims to measure your "uniqueness" from a single visit with caution.

A stable result does not prove that your browser lacks protection. Brave, for example, derives its randomization from a seed that changes per browsing session and per site. Two reads on the same page therefore match, while the value differs on other sites and in the next session. Safari also adds noise to fingerprintable APIs in Private Browsing, and Firefox added further fingerprinting protections in Private Browsing and in Strict mode in version 145.

Blocking canvas outright, as some extensions do, can itself be unusual and therefore noticeable.`,
    },
    {
      id: "fixes",
      heading: "Reducing canvas fingerprinting",
      body: `- **Use a browser with built-in protection:** Brave randomizes canvas output per site and session. Firefox applies extra fingerprinting protection in Private Browsing and with Enhanced Tracking Protection set to Strict. Safari adds noise in Private Browsing.
- **Tor Browser** aims to make every user look the same rather than random, which is the strongest approach. It does break some sites.
- **Extensions** that block or alter canvas reads work, but they can break drawing tools and image editors. A rare extension can also make you more distinctive.

Remember that canvas is only one signal. Fonts, screen size, time zone and the IP address all combine with it.`,
    },
  ],
  faq: [
    {
      question: "Does a canvas fingerprint identify me personally?",
      answer: "No. It describes how your software and hardware draw one image, and many people share the same result. It only becomes identifying when combined with other signals, and even then it is a probability rather than proof.",
    },
    {
      question: "Why do both reads match even though I use Brave?",
      answer: "Brave's noise is seeded per session and per site, so it stays constant on one page during one session. Compare the ID on another site, or after restarting the browser, to see the change.",
    },
    {
      question: "Can canvas fingerprinting run without my knowledge?",
      answer: "Yes. Drawing to a canvas that is never shown on screen needs no permission, and reading it back is fast. That is why several browsers now alter or restrict the readback instead.",
    },
  ],
  sources: [
    { title: "MDN: HTMLCanvasElement.toDataURL()", url: "https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL" },
    { title: "Brave: Fingerprinting protections", url: "https://github.com/brave/brave-browser/wiki/Fingerprinting-Protections" },
    { title: "WebKit: Features in Safari 17.0 (Private Browsing)", url: "https://webkit.org/blog/14445/webkit-features-in-safari-17-0/" },
    { title: "Firefox 145.0 release notes", url: "https://www.firefox.com/en-US/firefox/145.0/releasenotes/" },
  ],
};

export default content;
