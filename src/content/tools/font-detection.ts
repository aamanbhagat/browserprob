import type { ToolContent } from "@/content/types";

const content: ToolContent = {
  sections: [
    {
      id: "measures",
      heading: "What font detection measures",
      body: `Browsers don't give websites a list of your installed fonts, but a page can still find out whether a particular font is available. It draws text in that font and measures the result. The set of fonts that pass depends on your operating system, your language packs and any fonts you installed yourself, such as design tools or office software. That is why font lists are a common fingerprinting signal.

This test checks 40 widely used font names, from system fonts like Arial and Segoe UI to popular web and coding fonts like Roboto and JetBrains Mono.`,
    },
    {
      id: "how-it-works",
      heading: "How the test works",
      body: `For each of the three generic families (monospace, sans-serif and serif), the page measures the width and height of the string "mmmmmmmmmmlli" at 72 px. Then it measures the same string with each test font listed first and the generic family as the fallback, for example \`"Lato", sans-serif\`.

If the browser has the font, the text is drawn in it and the size usually changes. If it doesn't, the browser falls back and the size matches the baseline. A font counts as distinguishable when any of the three measurements differs. All 120 probe elements are added to the page off-screen in one batch, measured, and removed.`,
    },
    {
      id: "reading",
      heading: "How to read your result",
      body: `**Distinguishable font names** is how many of the 40 names measured differently from the fallbacks. The fonts that passed are listed in their own typeface, and the rest are under "Not distinguishable".

Typical results differ by platform. A Windows machine usually shows Arial, Calibri, Segoe UI, Consolas and similar. A Mac shows Helvetica, Menlo and Monaco. Linux often shows few of these names at all. Fonts you installed yourself, such as Fira Code or Montserrat, are the entries that set a list apart.`,
    },
    {
      id: "limitations",
      heading: "False positives and restrictions",
      body: `The method has known blind spots:

- **False positives:** a browser can substitute a similar font for a missing name. For example, a system may map "Helvetica" to Arial or another sans-serif, so text changes size even though the exact font isn't installed.
- **False negatives:** a font whose metrics happen to match the fallback for this string goes undetected.
- **Browser restrictions:** Safari only makes web fonts and fonts bundled with the operating system available to pages, so fonts you installed yourself don't show up. Firefox 145's fingerprinting protection, which applies in Private Browsing and with Strict tracking protection, also restricts which fonts pages can detect.

The test covers 40 names, while real fingerprinting scripts test hundreds. A short result here does not mean a tracker would find nothing.`,
    },
    {
      id: "fixes",
      heading: "Reducing font fingerprinting",
      body: `- **Use Safari, or Firefox in Private Browsing or Strict mode,** to stop pages seeing fonts you installed yourself.
- **Tor Browser** ships with a fixed font set that is the same for all its users.
- **Uninstalling fonts you no longer use** makes your list more common. You don't need to remove fonts that came with the system.

Blocking font measurement outright with an extension can break page layouts, because sites measure text for legitimate reasons too.`,
    },
  ],
  faq: [
    {
      question: "Can websites see every font installed on my computer?",
      answer: "Not directly. They can only test font names they guess, one by one. Safari and Firefox's stricter modes also hide fonts you installed yourself.",
    },
    {
      question: "Why is a font listed as detected when I don't have it?",
      answer: "Your system may substitute a similar font when that name is requested, which changes the measured size. The test then counts the name as distinguishable, which is a false positive.",
    },
    {
      question: "Does BrowserProbe send my font list anywhere?",
      answer: "No. The measurements run in this tab and the list is only displayed to you.",
    },
  ],
  sources: [
    { title: "WebKit: Tracking Prevention in WebKit (font availability)", url: "https://webkit.org/tracking-prevention/" },
    { title: "Firefox 145.0 release notes (fingerprinting protections)", url: "https://www.firefox.com/en-US/firefox/145.0/releasenotes/" },
    { title: "MDN: HTMLElement.offsetWidth", url: "https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetWidth" },
  ],
};

export default content;
