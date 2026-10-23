import type { ToolContent } from "@/content/types";

const content: ToolContent = {
  sections: [
    {
      id: "what-this-means",
      heading: "What this means",
      body: "The **Network Information API** provides details about your network connection. The **effective type** (4g, 3g, 2g, slow-2g) is an estimate based on recent performance measurements, not your actual connection technology.\n\n**Downlink speed** shows the estimated bandwidth in Mbps. **RTT** (round-trip time) measures latency — lower is better for real-time applications like video calls and gaming.\n\nThis API is only available in Chromium-based browsers. Firefox and Safari do not expose it, so every value shows as not supported there.",
    },
  ],
  faq: [
    { question: "What is the Network Information API?", answer: "The Network Information API provides web applications with access to the system's network connection type (such as cellular or Wi-Fi) and its performance metrics (like estimated bandwidth and round-trip latency)." },
    { question: "Why is my connection speed showing as 'Not available'?", answer: "The Network Information API is only implemented in Chromium-based browsers such as Chrome, Edge and Opera. Firefox and Safari do not expose it." },
  ],
  sources: [],
};

export default content;
