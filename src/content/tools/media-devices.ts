import type { ToolContent } from "@/content/types";

const content: ToolContent = {
  sections: [
    {
      id: "what-this-means",
      heading: "What this means",
      body: "The **MediaDevices API** allows websites to enumerate available audio/video devices without requesting permission to use them. The number and types of devices can contribute to your browser fingerprint.\n\nDevice labels are normally revealed only after permission. Before permission, generic entries may still show available kinds and counts. These can contribute to a broader fingerprint but do not identify you by themselves.",
    },
  ],
  faq: [
    { question: "Can websites access my camera and microphone without permission?", answer: "Modern browsers require permission before a site can capture camera or microphone streams. Device enumeration may return device kinds and placeholder entries before permission; labels and stable identifiers are normally restricted." },
    { question: "How is media device listing used for browser fingerprinting?", answer: "Available device kinds and counts may contribute to a broader browser fingerprint. Labels and identifiers are restricted until permission in modern browsers, and the result alone does not prove identity." },
  ],
  sources: [],
};

export default content;
