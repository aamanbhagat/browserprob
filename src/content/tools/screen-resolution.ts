import type { ToolContent } from "@/content/types";

const content: ToolContent = {
  sections: [
    {
      id: "what-this-means",
      heading: "What this means",
      body: "**Screen resolution** is the total number of pixels your monitor can display. Higher resolutions mean sharper images and more screen space.\n\nThe **device pixel ratio** (DPR) indicates how many physical pixels make up one CSS pixel. A DPR of 2 means you have a \"Retina\" or HiDPI display where each CSS pixel is rendered with 4 physical pixels (2×2).\n\n**Viewport size** is the actual visible area of your browser window. This is what responsive websites use to determine their layout — it's smaller than your screen resolution because it excludes browser chrome (toolbars, scrollbars).",
    },
  ],
  faq: [
    { question: "What is the difference between screen size and viewport size?", answer: "Screen size is the total physical resolution of your monitor, whereas viewport size is the actual area within the browser window that displays the web page (excluding address bars and bookmarks bars)." },
    { question: "What is Device Pixel Ratio (DPR)?", answer: "Device Pixel Ratio (DPR) is the ratio between physical pixels and logical (CSS) pixels. High-density screens (like Retina displays) have a DPR of 2 or 3, meaning they use multiple physical pixels to draw a single logical pixel for sharper visuals." },
  ],
  sources: [],
};

export default content;
