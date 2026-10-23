import type { ToolContent } from "@/content/types";

const content: ToolContent = {
  sections: [
    {
      id: "what-this-means",
      heading: "What this means",
      body: "**CPU cores** (navigator.hardwareConcurrency) reveals how many logical processor cores your device has. This helps websites optimize performance-intensive tasks but also contributes to fingerprinting.\n\n**Device memory** shows approximately how much RAM your device has. This API is designed to help websites serve lighter or heavier content based on device capability.\n\nThe **Battery Status API** is only available in Chromium-based browsers. Firefox removed it in version 52 after researchers showed battery level and charging time could link visits across websites.",
    },
  ],
  faq: [
    { question: "How does a browser know my CPU cores and RAM?", answer: "Browsers access hardware information through properties like 'navigator.hardwareConcurrency' (logical processor cores) and 'navigator.deviceMemory' (approximate RAM capacity in gigabytes) to help developers tailor web performance." },
    { question: "Why is the Battery Status API considered a privacy risk?", answer: "The Battery Status API was found to be a tracking risk because a device's precise battery level (e.g. 84.13%) and remaining charging time could be used as a short-term identifier to link sessions across different domains." },
  ],
  sources: [],
};

export default content;
