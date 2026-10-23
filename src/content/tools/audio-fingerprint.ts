import type { ToolContent } from "@/content/types";

const content: ToolContent = {
  sections: [
    {
      id: "what-this-means",
      heading: "What this means",
      body: "**Audio fingerprinting** uses the Web Audio API to process a known signal. Browser and operating-system implementation details can affect the result, so it may be combined with other signals.\n\nThis sample is rendered silently in an **OfflineAudioContext**; it does not play through your speakers. Its non-cryptographic sample ID is useful for repeatability checks, not proof of identity or uniqueness.",
    },
  ],
  faq: [
    { question: "What is an audio fingerprint?", answer: "An audio fingerprinting sample processes a known signal with the Web Audio API and summarizes the rendered buffer. Browser, operating-system, and processing differences may affect the output, which can contribute one signal to a broader fingerprint." },
    { question: "Does audio fingerprinting play actual sound?", answer: "No. Audio fingerprinting is performed silently using an OfflineAudioContext, meaning the audio buffer is processed entirely in memory without routing any sound to your computer's speakers." },
  ],
  sources: [],
};

export default content;
