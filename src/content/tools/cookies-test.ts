import type { ToolContent } from "@/content/types";

const content: ToolContent = {
  sections: [
    {
      id: "measures",
      heading: "What this test checks",
      body: `Websites keep data in your browser in several ways, and each one can be blocked separately. This test tries every common first-party mechanism on this site and reports which ones actually work:

- **Cookies:** small values sent back to the server with matching requests. Logins and preferences depend on them.
- **localStorage and sessionStorage:** key-value storage that stays in the browser. localStorage persists until cleared; sessionStorage ends when you close the tab.
- **IndexedDB:** a database for larger, structured data, used by web apps that work offline.
- **Cache Storage:** the store service workers use to keep copies of responses.

It also shows how much storage the browser estimates this site has used and is allowed to use, and whether the site's storage is marked as persistent.`,
    },
    {
      id: "how-it-works",
      heading: "How each check works",
      body: `Each check writes a test value, reads it back and deletes it straight away:

- **Cookie:** the page sets \`_bp_probe=1\` with \`SameSite=Lax\`, confirms it appears in \`document.cookie\`, then expires it.
- **Web Storage:** the page calls \`setItem\` and \`getItem\`. A browser that disables storage often throws an exception as soon as \`localStorage\` is touched; that counts as blocked.
- **IndexedDB:** the page opens a database, writes one record in a transaction, waits for the transaction to complete, and then deletes the database. It is not enough that the \`indexedDB\` object exists, because some private modes expose it but refuse to open databases.
- **Cache Storage:** the page opens and deletes a named cache.

The quota figures come from \`navigator.storage.estimate()\` and persistence from \`navigator.storage.persisted()\`. The page also shows \`navigator.cookieEnabled\`, so you can compare the browser's claim with what actually happened.`,
    },
    {
      id: "reading",
      heading: "How to read your result",
      body: `**Works** means the value was written and read back. **Blocked** means the browser refused or threw an error. **Not supported in this browser** means the API does not exist here.

If **navigator.cookieEnabled** says yes while the **First-party cookie** row says blocked, something more specific than the global setting is stopping cookies. Common causes are a per-site block, an extension, or strict tracking protection.

**Used** and **Quota** are estimates for this site only. Browsers deliberately pad usage figures, and quotas depend on free disk space. Chromium-based browsers allow up to about 60% of the disk per origin, while Firefox allows the smaller of 10% of the disk or 10 GiB per site group. "Not granted (best effort)" under **Persistent storage** is the normal state: the browser may clear the data when space runs low.`,
    },
    {
      id: "limitations",
      heading: "What this test doesn't cover",
      body: `Everything here runs in the site you are visiting, a **first-party** context. It cannot show how your browser treats **third-party** cookies, which are set by other sites embedded in a page, such as ads or chat widgets. Testing that needs a second, separate site loaded inside this one. Browsers also handle it differently:

- **Safari** has blocked third-party cookies by default since version 13.1.
- **Firefox** partitions all third-party state per top-level site by default (State Partitioning).
- **Chrome** still allows third-party cookies unless you change its settings, after Google decided in April 2025 not to introduce a separate prompt.

Embedded content that needs its own unpartitioned cookies can ask for them through the Storage Access API.

A "Works" result also says nothing about how long data will last. Browsers may expire script-written storage on their own schedule, and private windows discard everything when they close.`,
    },
    {
      id: "fixes",
      heading: "If cookies or storage are blocked",
      body: `- **Chrome and Edge:** Settings → Privacy and security → Third-party cookies (or Cookies and site data). Check that sites may save data, and look for this site under the exceptions.
- **Firefox:** Settings → Privacy & Security → Enhanced Tracking Protection. In Custom mode, check the cookie setting, and use the shield icon in the address bar for per-site exceptions.
- **Safari:** Settings → Privacy. "Block all cookies" blocks first-party storage too.
- **Extensions:** privacy and ad-blocking extensions can block storage on specific sites. Try a window with extensions disabled to find out.

If a site you trust keeps forgetting your login, allowing its cookies is usually enough. You don't need to loosen protection for every site.`,
    },
  ],
  faq: [
    {
      question: "What is the difference between cookies and localStorage?",
      answer: "Cookies that match a request's domain, path and SameSite rules are sent to the server with it, which is why they hold login sessions. localStorage stays in the browser unless page code sends it somewhere, and it can hold much more data.",
    },
    {
      question: "What are third-party cookies?",
      answer: "They are cookies set by a domain other than the site in the address bar, usually by embedded ads, analytics or widgets. Safari blocks them by default, Firefox partitions them per site, and Chrome allows them unless you change its settings.",
    },
    {
      question: "Why does the browser say cookies are enabled when the test cookie failed?",
      answer: "navigator.cookieEnabled reflects the global setting. A block for this particular site, an extension or a tracking-protection rule can still stop the actual write, which is what the test measures.",
    },
    {
      question: "Does this test leave anything behind?",
      answer: "No. Every test value, database and cache it creates is deleted immediately after it is checked.",
    },
  ],
  sources: [
    { title: "MDN: Storage quotas and eviction criteria", url: "https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria" },
    { title: "MDN: State Partitioning (Firefox)", url: "https://developer.mozilla.org/en-US/docs/Web/Privacy/Guides/State_Partitioning" },
    { title: "WebKit: Full Third-Party Cookie Blocking and More", url: "https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/" },
    { title: "Privacy Sandbox: Next steps for Privacy Sandbox and tracking protections in Chrome (April 2025)", url: "https://privacysandbox.google.com/blog/privacy-sandbox-next-steps" },
    { title: "MDN: Storage Access API", url: "https://developer.mozilla.org/en-US/docs/Web/API/Storage_Access_API" },
  ],
};

export default content;
