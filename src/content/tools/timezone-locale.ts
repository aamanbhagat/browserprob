import type { ToolContent } from "@/content/types";

const content: ToolContent = {
  sections: [
    {
      id: "measures",
      heading: "What this test reads",
      body: `The JavaScript \`Intl\` API gives every page your browser's time and formatting settings. This test shows:

- the **time zone** name (an IANA zone such as \`Europe/Berlin\`) and its current UTC offset;
- your **preferred languages**, in order;
- the **formatting locale** and the conventions it implies: date, time and number formats, 12- or 24-hour clock, calendar and numbering system.

It also compares your time zone with the one our hosting provider's database associates with your IP address.`,
    },
    {
      id: "how-it-works",
      heading: "How the values are read",
      body: `The time zone, calendar and numbering system come from \`Intl.DateTimeFormat().resolvedOptions()\`. The test formats a sample date and the number 1234567.891 to show how your locale writes them. Some browsers still report old zone names, such as \`Asia/Calcutta\` or \`Europe/Kiev\`. These are mapped to the current names (\`Asia/Kolkata\`, \`Europe/Kyiv\`), and the reported name is shown next to the current one.

For the IP comparison, the page makes one request to this site's \`/api/ip\` endpoint, which passes on the time zone our host's IP database gives your address. Zones are compared by name first. If the names differ, the UTC offsets of both zones are compared at the current moment, because neighbouring zones often share an offset.`,
    },
    {
      id: "reading",
      heading: "How to read your result",
      body: `**Time zone** is a setting on your device, usually set automatically from its location. It is not measured from the network.

**Browser vs IP time zone** has four possible outcomes:

- **"Same time zone":** the two agree.
- **"Different zone name, same UTC offset right now":** usually harmless, for example Paris and Berlin.
- **"Different UTC offset":** your device clock and your IP address point to different regions.
- **"Not available":** the comparison could not be made.

**Preferred languages** is the list your browser also sends in the \`Accept-Language\` header. Sites use it to choose a language for you.

**Formatting locale** decides how numbers and dates look. For example, "12,34,567.891" is the Indian grouping of the same number that en-US writes as "1,234,567.891".`,
    },
    {
      id: "limitations",
      heading: "What a time zone does and doesn't prove",
      body: `A time zone narrows things down to a broad region at best. Millions of people share each zone, travellers often keep their home time zone, and the setting is easy to change. The IP-based zone is a database estimate and inherits all the inaccuracy of IP geolocation.

A mismatch between the two is common and innocent when you use a VPN, travel, or are routed through another region by your provider. Fraud-detection systems still treat it as a signal, which is why it is shown here. Locale and language settings can also make a browser stand out, especially rare combinations such as an uncommon language list with an unusual time zone.`,
    },
    {
      id: "fixes",
      heading: "Changing your time zone or language",
      body: `- **Time zone:** change it in your operating system's date and time settings. Browsers read it from there, and most don't offer a separate setting. Firefox with \`privacy.resistFingerprinting\` enabled reports UTC to every site.
- **Languages:** in Chrome and Edge, open Settings → Languages. In Firefox, open Settings → General → Language. Safari follows the macOS or iOS language order.
- **If a VPN makes sites think you are elsewhere:** that comes from the IP address, not from these settings. Picking a VPN server in your own region removes the mismatch.`,
    },
  ],
  faq: [
    {
      question: "Can a VPN change my browser's time zone?",
      answer: "No. A VPN changes the IP address websites see, but the time zone comes from your device settings. That is why a VPN often creates a mismatch between the two.",
    },
    {
      question: "Why does my browser report Asia/Calcutta instead of Asia/Kolkata?",
      answer: "The time zone database keeps old names as aliases, and some browsers still return them. Both names refer to the same zone, so BrowserProbe shows the current name and the reported one.",
    },
    {
      question: "Is the time zone used for browser fingerprinting?",
      answer: "Yes, it is one of the easiest signals to read, together with the language list. On its own it is shared by many people; it becomes more telling in combination with other values.",
    },
  ],
  sources: [
    { title: "MDN: Intl.DateTimeFormat.prototype.resolvedOptions()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/resolvedOptions" },
    { title: "MDN: Navigator.languages", url: "https://developer.mozilla.org/en-US/docs/Web/API/Navigator/languages" },
    { title: "Vercel: Request headers (x-vercel-ip-timezone)", url: "https://vercel.com/docs/headers/request-headers" },
  ],
};

export default content;
