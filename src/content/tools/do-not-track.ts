import type { ToolContent } from "@/content/types";

const content: ToolContent = {
  sections: [
    {
      id: "what-this-means",
      heading: "What this means",
      body: "**Do Not Track (DNT)** is a browser setting that asks websites not to track you. Honoring it is voluntary and most sites ignore it. Safari removed it, and Firefox removed its DNT checkbox in version 135.\n\n**Global Privacy Control (GPC)** is a newer opt-out signal. Unlike DNT, it is recognized by some laws: California's Attorney General says covered businesses must honor a user-enabled GPC signal as a request to stop the sale or sharing of personal information. Its legal effect depends on where you are and which business receives it.\n\nFirefox (version 120 and later) has a setting called \"Tell websites not to sell or share my data\" that turns GPC on. Some other browsers and extensions also send it.",
    },
  ],
  faq: [
    { question: "What is the difference between Do Not Track (DNT) and Global Privacy Control (GPC)?", answer: "Do Not Track is a voluntary request that most sites ignore. Global Privacy Control is an opt-out signal that some laws recognize; in California, covered businesses must treat it as a request to stop selling or sharing your personal information." },
    { question: "How do I turn on Global Privacy Control?", answer: "In Firefox, turn on \"Tell websites not to sell or share my data\" in Privacy & Security settings. Some other browsers and extensions send GPC as well; check their settings." },
  ],
  sources: [],
};

export default content;
