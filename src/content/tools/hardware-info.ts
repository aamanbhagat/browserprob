import type { ToolContent } from "@/content/types";

const content: ToolContent = {
  sections: [
    {
      id: "measures",
      heading: "What this test reads",
      body: `Browsers expose a few coarse hardware details so web apps can adapt to the device they run on:

- **Logical CPU cores** (\`navigator.hardwareConcurrency\`): how many threads can run in parallel, used to size worker pools.
- **Device memory** (\`navigator.deviceMemory\`): an approximate amount of RAM, used to decide whether to load lighter content.
- **GPU:** the renderer string from WebGL, the same value the [WebGL test](/tools/webgl-info) explains in detail.
- **Platform and touch points:** \`navigator.platform\` and \`navigator.maxTouchPoints\`.
- **Battery:** level and charging state from the Battery Status API, where it exists.`,
    },
    {
      id: "how-it-works",
      heading: "How the values are read",
      body: `Each value is a direct property read, with no permission required. Battery information needs one asynchronous call to \`navigator.getBattery()\`. When a property does not exist in your browser, the page says "Not supported in this browser" rather than showing an empty value or a zero. That way you can tell apart a browser that hides a value from one that reports it as unknown.`,
    },
    {
      id: "reading",
      heading: "How to read your result",
      body: `**Logical CPU cores** counts hardware threads, not physical cores. A 6-core processor with hyper-threading reports 12. Safari limits this value to either 4 or 8, whatever the real number.

**Device memory** is rounded on purpose. Browsers round to the nearest power of two and clamp the value to a range. Chrome on desktop reports 2, 4, 8, 16 or 32 GB since version 147 (8 was the maximum before), and Chrome on Android reports 1 to 8 GB. A 24 GB machine therefore shows 16 or 32, never 24. Firefox and Safari don't implement this property.

**Battery** is only available in Chromium-based browsers. A desktop computer without a battery normally reports 100% and charging, which is what the specification tells browsers to return when no battery is present.

**navigator.platform** is a legacy value. Many Macs report "MacIntel" even on Apple silicon.`,
    },
    {
      id: "limitations",
      heading: "Why hardware values are rough by design",
      body: `Each of these values was once more precise, and each was cut back after it proved useful for fingerprinting. Precise battery levels and discharge times let researchers link visits across websites. Firefox removed the Battery Status API in version 52 for that reason, and Safari never shipped it. Memory rounding and Safari's core-count clamping exist for the same reason.

What remains is coarse: it sorts devices into broad tiers. Together with screen size, GPU string and fonts, it still contributes to a fingerprint, but none of these values can show your exact device.`,
    },
    {
      id: "fixes",
      heading: "Reducing what hardware values reveal",
      body: `There is no browser setting that hides these specific values, and spoofing them can make performance-sensitive sites misbehave.

Browsers with fingerprinting protection report standardised values instead. Firefox's protection in Private Browsing and Strict mode changes the reported core count, and Tor Browser presents the same values for all its users. Brave also limits the precision of several of these properties.

If you use Chrome, the Battery Status API is available to every site, and there is currently no per-site permission for it.`,
    },
  ],
  faq: [
    {
      question: "How can a website know how many CPU cores I have?",
      answer: "Browsers expose navigator.hardwareConcurrency so web apps can run the right number of background threads. Safari clamps it to 4 or 8, and some privacy modes report a fixed value.",
    },
    {
      question: "Why does device memory show less RAM than I have?",
      answer: "The value is rounded to a power of two and capped. Since Chrome 147 desktop caps at 32 GB, and older versions stopped at 8 GB, so many machines with more memory report the cap.",
    },
    {
      question: "Why is the Battery Status API considered a privacy risk?",
      answer: "Researchers showed that the precise battery level and remaining time could link a person's visits across different websites for a short period. Firefox removed the API in version 52 in response.",
    },
  ],
  sources: [
    { title: "MDN: Navigator.deviceMemory", url: "https://developer.mozilla.org/en-US/docs/Web/API/Navigator/deviceMemory" },
    { title: "MDN: Navigator.hardwareConcurrency", url: "https://developer.mozilla.org/en-US/docs/Web/API/Navigator/hardwareConcurrency" },
    { title: "MDN: Battery Status API", url: "https://developer.mozilla.org/en-US/docs/Web/API/Battery_Status_API" },
  ],
};

export default content;
