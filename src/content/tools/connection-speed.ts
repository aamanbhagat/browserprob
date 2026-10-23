import type { ToolContent } from "@/content/types";

const content: ToolContent = {
  sections: [
    {
      id: "measures",
      heading: "What this page measures",
      body: `**This is not a bandwidth speed test.** It shows two kinds of connection information that a web page can read without downloading test files:

- **How this site's first page loaded in this tab,** from the Navigation Timing API: which HTTP version was used and how long the DNS lookup, connection setup, TLS handshake, time to first byte and HTML download took. This works in all current browsers.
- **The browser's own connection estimate,** from the Network Information API: an effective connection type (4g, 3g, 2g or slow-2g), estimated downlink and round-trip time, and whether Data Saver is on. Only Chromium-based browsers provide this.`,
    },
    {
      id: "how-it-works",
      heading: "How the values are read",
      body: `The timing values come from \`performance.getEntriesByType("navigation")\`, the entry the browser records for the document request that opened this site in the current tab. Each phase is the difference between two timestamps; for example, time to first byte is \`responseStart − requestStart\`.

A phase that did not happen is shown as reused or not measured, rather than as zero. That covers a cached DNS answer, a reused connection, or a plain HTTP page without TLS.

The estimates come from \`navigator.connection\`. Chromium derives them from recently observed traffic, not from a test, and limits them for privacy: downlink is never reported above 10 Mbps and round-trip time never above 3,000 ms.`,
    },
    {
      id: "reading",
      heading: "How to read your result",
      body: `**Protocol** "HTTP/2" or "HTTP/3" is normal for this site. HTTP/3 runs over QUIC and often helps on lossy mobile networks.

**Time to first byte** is the time between the browser sending the request and the first byte of the answer arriving. It includes the network round trip and the server's work, and well under a second is typical.

**Connection setup** and **TLS handshake** are only measured for a fresh connection. Navigating within the site reuses the first measurement, so reload the page to measure again.

**Effective connection type** is a category, not your actual technology. A fast Wi-Fi network shows as "4g", because that is the highest category the API defines.`,
    },
    {
      id: "limitations",
      heading: "What this can't tell you",
      body: `None of these numbers measures throughput. The downlink estimate stops at 10 Mbps by design, so a gigabit connection and a decent mobile connection look the same. The timing describes one small request to one server. It reflects the distance to the nearest data centre of our host as much as your connection.

Firefox and Safari don't implement the Network Information API, so those rows say "Not supported in this browser". "Connection type" (Wi-Fi, cellular, Ethernet) is only reported on Android and ChromeOS. Some privacy tools also reduce timer precision, which rounds small timing values.

To measure real speed, use a dedicated speed test that downloads and uploads large amounts of data, ideally to a server near you.`,
    },
    {
      id: "fixes",
      heading: "If pages load slowly",
      body: `- **High time to first byte** on many sites points to latency: distance, a busy Wi-Fi channel, or a VPN routing your traffic far away. Try a closer VPN server, or test without the VPN.
- **Slow DNS lookups** can improve with your router's or operating system's DNS settings, or with the DNS-over-HTTPS option in your browser.
- **Data Saver on** makes some sites send lighter pages on purpose. Turn it off in your browser or operating system if you don't need it.`,
    },
  ],
  faq: [
    {
      question: "Is this a connection speed test?",
      answer: "No. It shows the browser's built-in estimates and the timing of one page load. Measuring real download speed requires transferring large amounts of data, which this page deliberately does not do.",
    },
    {
      question: "Why does my connection type show 4g on Wi-Fi?",
      answer: "The effective connection type describes measured performance, not technology. Any reasonably fast connection, wired or wireless, falls into the top category, which is called 4g.",
    },
    {
      question: "Why are the network estimates not supported in my browser?",
      answer: "Only Chromium-based browsers such as Chrome, Edge and Opera implement the Network Information API. Firefox and Safari do not expose it; the page-load timing still works there.",
    },
  ],
  sources: [
    { title: "MDN: PerformanceNavigationTiming", url: "https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming" },
    { title: "MDN: Network Information API", url: "https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API" },
    { title: "MDN: NetworkInformation.downlink", url: "https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/downlink" },
  ],
};

export default content;
