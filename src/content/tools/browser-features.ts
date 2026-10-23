import type { ToolContent } from "@/content/types";

const content: ToolContent = {
  sections: [
    {
      id: "what-this-means",
      heading: "What this means",
      body: "This test checks your browser's support for **modern web APIs**. More supported APIs generally means a more capable browser, but it also increases your fingerprint surface area.\n\nAPIs marked with ✗ may not be supported by your specific browser, or may require user permission or a secure context (HTTPS) to function.",
    },
  ],
  faq: [
    { question: "What is browser feature detection?", answer: "Browser feature detection is a practice of checking if a specific API, property, or method is supported by the user's browser before executing code. This is a robust alternative to user-agent sniffing." },
    { question: "Why do different browsers support different web APIs?", answer: "Browser vendors prioritize APIs based on standards consensus, security boundaries, user utility, and privacy impacts. For example, Safari disables many sensors and hardware APIs by default to resist fingerprint tracking." },
  ],
  sources: [],
};

export default content;
