import type { ToolContent } from "@/content/types";

const content: ToolContent = {
  sections: [
    {
      id: "what-this-means",
      heading: "What this means",
      body: "Current browsers return a fixed list from **navigator.plugins**: five PDF viewer entries when the browser can show PDFs inline, and an empty list when it can't. It no longer reflects anything you installed.\n\n**MIME types** listed here are tied to the same fixed plugin list, so they do not describe everything your browser can open.",
    },
  ],
  faq: [
    { question: "Why does the list of browser plugins matter for privacy?", answer: "Modern browsers expose a reduced, standardized Navigator.plugins list, often centered on built-in PDF handling rather than a complete inventory. Returned values can still contribute one signal to browser classification." },
    { question: "Can websites see all of my browser extensions?", answer: "Websites cannot directly read your list of installed extensions (like adblockers or password managers) due to security constraints. However, they can infer their presence by observing modified DOM elements, blocked network requests, or injected extension stylesheets." },
  ],
  sources: [],
};

export default content;
