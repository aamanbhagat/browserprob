import type { ToolContent } from "@/content/types";

const content: ToolContent = {
  sections: [
    {
      id: "what-this-means",
      heading: "What this means",
      body: "**Cookies** are small values websites use for sessions and preferences. This page writes and immediately deletes one first-party test cookie; it does not test cross-site or third-party cookie policy.\n\n**LocalStorage** and **SessionStorage** are newer web storage APIs that let websites store data directly in your browser. LocalStorage persists until cleared, while SessionStorage is erased when you close the tab.\n\n**IndexedDB** is a powerful client-side database that allows websites to store large amounts of structured data. It's used by modern web apps for offline functionality.",
    },
  ],
  faq: [
    { question: "What is the difference between browser cookies and local storage?", answer: "Cookies that match a request's domain, path, security, and SameSite rules are sent with that request, which makes them useful for sessions. Web Storage values remain client-side unless page code sends them and usually offer more space." },
    { question: "What are third-party cookies?", answer: "Third-party cookies are set by a domain other than the site in the address bar, often by embedded ads or widgets. Safari blocks them by default, Firefox partitions them per site, and Chrome still allows them unless you change its settings." },
  ],
  sources: [],
};

export default content;
