import type { ToolContent } from "@/content/types";

const content: ToolContent = {
  sections: [
    {
      id: "what-this-means",
      heading: "What this means",
      body: "**Font detection** estimates which font names are available by comparing rendered text dimensions with fallback fonts. Browser font substitution can produce false positives or negatives.\n\nOperating systems ship different font sets, and custom fonts can make a list less common. This result is one observable signal; BrowserProbe does not assign an unsupported uniqueness score.",
    },
  ],
  faq: [
    { question: "How does a browser detect system fonts?", answer: "Browsers detect installed fonts by rendering text using a fallback font (like sans-serif) and comparing its dimensions (width/height) to the same text rendered with the target font. If the dimensions differ, the target font is present." },
    { question: "What is font fingerprinting?", answer: "Font fingerprinting tests which font names appear available and combines the pattern with other browser signals. The result can narrow a population, but one font list does not prove a visitor's identity or uniqueness." },
  ],
  sources: [],
};

export default content;
