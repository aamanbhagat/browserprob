import type { ToolContent } from "@/content/types";

const content: ToolContent = {
  sections: [
    {
      id: "what-this-means",
      heading: "What this means",
      body: "**User-Agent Client Hints** let Chromium-based browsers share browser and device details in separate, named values instead of one long user-agent string. The brands, a mobile flag and the platform are available to every page; more detailed values such as the platform version, CPU architecture and device model are only returned when a page asks for them.\n\nFirefox and Safari do not implement Client Hints, so this test shows them as not supported there.",
    },
  ],
  faq: [
    { question: "Why do I see a brand like \"Not)A;Brand\"?", answer: "Chromium adds a deliberately odd extra brand, known as GREASE, so that sites do not depend on an exact brand list. BrowserProbe hides it because it carries no information." },
  ],
  sources: [],
};

export default content;
