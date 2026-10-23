import type { ToolContent } from "@/content/types";

const content: ToolContent = {
  sections: [
    {
      id: "measures",
      heading: "What this test checks",
      body: `Two browser settings let you state a privacy preference to every website:

- **Do Not Track (DNT)** asks sites not to track you. Browsers send it as the \`DNT: 1\` request header and expose it as \`navigator.doNotTrack\`.
- **Global Privacy Control (GPC)** tells sites you do not want your personal information sold or shared. It is sent as the \`Sec-GPC: 1\` header and exposed as \`navigator.globalPrivacyControl\`.

This page reads both JavaScript values and shows whether your browser exposes each signal and whether it is on.`,
    },
    {
      id: "how-it-works",
      heading: "How the values are read",
      body: `\`navigator.globalPrivacyControl\` is \`true\` when GPC is on and \`false\` when it is off. It is absent in browsers that don't implement GPC, and the page then shows "Not supported in this browser".

\`navigator.doNotTrack\` returns "1" when DNT is on and "0" when you have explicitly allowed tracking. Otherwise it returns nothing: \`null\` in Chromium browsers, "unspecified" in Firefox. Safari removed the property altogether. The page checks whether the property exists at all, so it can tell "your browser has DNT but it is off" apart from "your browser doesn't expose DNT". The raw value is shown underneath.`,
    },
    {
      id: "reading",
      heading: "How to read your result",
      body: `**Global Privacy Control: On** means every site you visit receives an opt-out request. Under some laws, covered businesses must act on it.

**Global Privacy Control: Not supported** is the normal result in Chrome, Edge and Safari, which don't implement it natively. Brave and DuckDuckGo's browser send it by default, and extensions such as Privacy Badger add it to other browsers.

**Do Not Track: Off** or **Not exposed** is the norm today. Firefox removed its DNT checkbox in version 135 and pointed users to GPC instead. Safari removed DNT years ago, partly because the extra header made browsers easier to fingerprint. Chrome still offers it, under Settings → Privacy and security → Third-party cookies.`,
    },
    {
      id: "limitations",
      heading: "What these signals do and don't do",
      body: `Neither signal blocks anything. Both are requests that the receiving site has to choose, or be required, to honor.

**DNT** never had legal force in most places, and its standard was abandoned. Google's own help page for Chrome says most websites, including Google's, don't change their behavior when they receive it.

**GPC** is different where a law recognizes it. The California Attorney General states that covered businesses must honor a user-enabled GPC signal as a valid request to stop selling or sharing personal information. Other US states have adopted similar opt-out signal rules. GPC is not an instrument of the EU's GDPR, and the specification itself notes that its legal effect depends on factors such as where you are.`,
    },
    {
      id: "fixes",
      heading: "Turning the signals on",
      body: `- **Firefox:** Settings → Privacy & Security → Website Privacy Preferences → "Tell websites not to sell or share my data". This turns GPC on.
- **Brave and DuckDuckGo:** GPC is on by default.
- **Chrome and Edge:** there is no built-in GPC setting. Extensions listed by the GPC project, such as Privacy Badger, OptMeowt and Disconnect, send it; confirm here afterwards. Chrome's DNT switch is in Settings → Privacy and security → Third-party cookies.
- **Safari:** neither signal is available.

After you change a setting, reload this page. Neither signal replaces tracker blocking: they only work with sites that respect them.`,
    },
  ],
  faq: [
    {
      question: "What is the difference between Do Not Track and Global Privacy Control?",
      answer: "Do Not Track is an old, voluntary request that most sites ignore. Global Privacy Control is a newer opt-out signal that some laws recognize; in California, covered businesses must treat it as a request to stop selling or sharing your personal information.",
    },
    {
      question: "How do I turn on Global Privacy Control?",
      answer: "In Firefox, enable \"Tell websites not to sell or share my data\" under Privacy & Security. Brave and DuckDuckGo send it by default; in Chrome or Edge, an extension such as Privacy Badger adds it. Safari has no option.",
    },
    {
      question: "Does turning on Do Not Track make me easier to track?",
      answer: "It can add a little: an uncommon header value is one more detail that distinguishes a browser. That concern is one reason Safari removed DNT.",
    },
    {
      question: "Does GPC apply in Europe under the GDPR?",
      answer: "No. GPC was designed around opt-out rights in US state privacy laws. Its specification says its legal effect depends on factors such as the person's location.",
    },
  ],
  sources: [
    { title: "W3C: Global Privacy Control specification", url: "https://w3c.github.io/gpc/" },
    { title: "California Attorney General: CCPA (GPC guidance)", url: "https://oag.ca.gov/privacy/ccpa" },
    { title: "MDN: Navigator.doNotTrack", url: "https://developer.mozilla.org/en-US/docs/Web/API/Navigator/doNotTrack" },
    { title: "MDN: Navigator.globalPrivacyControl", url: "https://developer.mozilla.org/en-US/docs/Web/API/Navigator/globalPrivacyControl" },
    { title: "Firefox 135.0 release notes", url: "https://www.firefox.com/en-US/firefox/135.0/releasenotes/" },
    { title: "Google Chrome Help: Turn \"Do Not Track\" on or off", url: "https://support.google.com/chrome/answer/2790761" },
    { title: "Global Privacy Control: supporting browsers and extensions", url: "https://globalprivacycontrol.org/" },
  ],
};

export default content;
