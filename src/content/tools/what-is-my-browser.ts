import type { ToolContent } from "@/content/types";

const content: ToolContent = {
  sections: [
    {
      id: "what-this-means",
      heading: "What this means",
      body: "Your **browser name and version** tell websites which software you're using to access the internet. This helps them deliver compatible content and features.\n\nThe **rendering engine** (Blink, Gecko, or WebKit) is the core technology that draws web pages on your screen. Chrome and Edge use Blink, Firefox uses Gecko, and Safari uses WebKit.\n\nYour **user agent string** is a text identifier your browser sends with every web request. It contains your browser name, version, operating system, and sometimes device information. Websites use this to optimize compatibility. Modern browsers can freeze or reduce version and operating-system details, so these values are browser-reported hints rather than verified hardware facts.",
    },
  ],
  faq: [
    { question: "What is a web browser rendering engine?", answer: "A rendering engine is the core software that draws web pages on your screen. Major engines include Blink (Chrome, Edge, Opera), Gecko (Firefox), and WebKit (Safari)." },
    { question: "What is a User Agent string?", answer: "A User Agent string is sent by a browser to help sites handle compatibility. It may contain browser and platform hints, but modern browsers can reduce or freeze details and it should not be treated as verified device identity." },
  ],
  sources: [],
};

export default content;
