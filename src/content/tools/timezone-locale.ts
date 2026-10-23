import type { ToolContent } from "@/content/types";

const content: ToolContent = {
  sections: [
    {
      id: "what-this-means",
      heading: "What this means",
      body: "Your **timezone** can suggest a broad geographic region, but it does not prove your physical location. Multiple regions can share an offset, and the setting can be changed or spoofed.\n\nThe **Intl API** provides locale-aware formatting for dates, numbers, and currencies. The specific locale, calendar system, and numbering system your browser uses all contribute to your digital fingerprint.\n\nWebsites use this information to serve localized content, adjust timestamps, and personalize the experience — but it also makes you more identifiable.",
    },
  ],
  faq: [
    { question: "Can a VPN change my browser timezone?", answer: "A standard VPN encrypts your network traffic and changes your public IP address, but it does not change your system clock or browser timezone settings. Websites can detect a discrepancy between your VPN IP location and browser timezone, which is a common indicator of proxy usage." },
    { question: "What is timezone fingerprinting?", answer: "A site can read the browser timezone through the Intl API. A timezone may narrow a broad region and contribute to a larger fingerprint, but many people share it and it does not prove location or identity." },
  ],
  sources: [],
};

export default content;
