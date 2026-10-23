import type { ToolContent } from "@/content/types";

const content: ToolContent = {
  sections: [
    {
      id: "what-this-means",
      heading: "What this means",
      body: "**WebGL** (Web Graphics Library) enables hardware-accelerated 3D graphics directly in your browser. It powers browser games, data visualizations, and interactive 3D experiences.\n\nThe **GPU renderer** and **vendor** strings may be exact, generalized, or software-rendered depending on browser and privacy protections. Together with limits and extensions, they can contribute to fingerprinting.\n\n**WebGL 2.0** offers significant improvements over 1.0, including 3D textures, occlusion queries, and transform feedback — features essential for advanced graphics applications.",
    },
  ],
  faq: [
    { question: "What is WebGL in a web browser?", answer: "WebGL (Web Graphics Library) is a JavaScript API for rendering high-performance interactive 3D and 2D graphics within any compatible web browser without the use of plug-ins." },
    { question: "How does WebGL contribute to device tracking?", answer: "WebGL can expose a renderer string, vendor string, limits, and supported extensions. Those details may contribute to a broader browser fingerprint, but they do not prove identity or uniqueness on their own." },
  ],
  sources: [],
};

export default content;
