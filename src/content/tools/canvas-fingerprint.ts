import type { ToolContent } from "@/content/types";

const content: ToolContent = {
  sections: [
    {
      id: "what-this-means",
      heading: "What this means",
      body: "**Canvas fingerprinting** draws an image using the Canvas API. Rendering can vary with the graphics stack, fonts, operating system, and browser settings, producing a signal that can be combined with other data.\n\nThe **sample hash** is a compact identifier for this drawing. Matching hashes do not prove two visitors are the same, and a single sample cannot prove that your browser is unique across the web.\n\nPrivacy-focused browsers may standardize or randomize canvas reads. Extensions can also change behavior, but they may introduce a less common configuration of their own.",
    },
  ],
  faq: [
    { question: "What is canvas fingerprinting?", answer: "Canvas fingerprinting draws a graphic and records the resulting pixels. Hardware, fonts, software, and privacy settings can influence the output, so the result may contribute one signal to a broader browser fingerprint. A single sample does not prove uniqueness." },
    { question: "How do I defend against canvas fingerprinting?", answer: "You can protect against canvas fingerprinting by using a browser that adds slight noise/randomness to canvas pixel reads (like Brave or Firefox with privacy.resistFingerprinting enabled), or by using specific browser extensions like Canvas Blocker." },
  ],
  sources: [],
};

export default content;
