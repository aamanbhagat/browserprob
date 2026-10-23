import type { ToolContent } from "@/content/types";

const content: ToolContent = {
  sections: [
    {
      id: "measures",
      heading: "What this test reads",
      body: `WebGL and WebGPU give web pages access to the graphics processor, for 3D graphics, games, maps and data visualisations. To work around driver bugs, both APIs also let pages ask which graphics hardware and driver they are talking to.

From WebGL, this test reports:

- the **renderer** and **vendor** strings;
- whether WebGL 2 is available;
- the version strings;
- limits such as the maximum texture size;
- the list of supported extensions.

From WebGPU, where it exists, it reports the adapter's vendor, architecture and description, whether it is a software fallback adapter, and how many optional features it offers.`,
    },
    {
      id: "how-it-works",
      heading: "How the values are read",
      body: `The page creates an off-screen canvas and requests a \`webgl2\` context, falling back to \`webgl\`. It first reads the standard \`RENDERER\` and \`VENDOR\` parameters. Chrome and Safari return generic placeholders ("WebKit WebGL") there, and only give the real driver string through the \`WEBGL_debug_renderer_info\` extension, so the page requests that extension only in that case. Firefox already returns a sanitised driver string from \`RENDERER\` and marks the extension as deprecated, so it is not requested there. The row "Renderer read from" shows which path was used. Afterwards the context is released.

For WebGPU, the page calls \`navigator.gpu.requestAdapter()\` with a three-second limit and reads \`adapter.info\`.`,
    },
    {
      id: "reading",
      heading: "How to read your result",
      body: `The **renderer** string in Chromium browsers usually follows the pattern \`ANGLE (vendor, renderer, backend)\`. ANGLE is the layer Chrome uses to translate WebGL onto Direct3D, Metal or Vulkan. Safari often reports a deliberately vague "Apple GPU". A renderer mentioning **SwiftShader** or **llvmpipe** means WebGL is running in software, without your graphics card. That is common in virtual machines and when hardware acceleration is switched off.

**Max texture size** (for example 8192 or 16384) and the extension count describe what the GPU and driver can do. Developers use them to decide what quality level to load.

For WebGPU, "API present, but no adapter was offered" means the browser supports WebGPU but declined to provide a GPU here, for example because of a blocklisted driver. Empty WebGPU fields are normal: the specification lets browsers withhold these values.`,
    },
    {
      id: "limitations",
      heading: "Limits and privacy considerations",
      body: `GPU strings are among the more identifying values a page can read, because they name hardware models and driver families. Browsers therefore coarsen them in different ways. Firefox sanitises the renderer string, Safari generalises it, and Brave can randomise parts of it. Two people with the same laptop model usually get the same string. A rare workstation card stands out more.

This page tests availability, not performance. It does not run a benchmark, and a high texture limit does not mean the GPU is fast. WebGPU support is still uneven: it is available in current Chrome and Edge on desktop, in Safari 26, and in Firefox on Windows since version 141. Other platforms are still rolling out.`,
    },
    {
      id: "fixes",
      heading: "If WebGL or WebGPU is missing or slow",
      body: `- **Turn hardware acceleration back on:** Chrome and Edge have it under Settings → System. Firefox has it under Settings → General → Performance.
- **Update your graphics driver.** Browsers block known-bad drivers, which disables WebGL or WebGPU.
- **Check the browser's own GPU report** (\`chrome://gpu\` in Chromium browsers, \`about:support\` in Firefox) to see why a feature is disabled.
- **For privacy,** browsers with fingerprinting protection reduce the detail in these strings without breaking graphics.`,
    },
  ],
  faq: [
    {
      question: "What does ANGLE mean in my GPU renderer string?",
      answer: "ANGLE is the translation layer Chromium uses to run WebGL on top of Direct3D, Metal or Vulkan. The text inside the brackets names your GPU vendor, model and the backend in use.",
    },
    {
      question: "Why does Safari only say \"Apple GPU\"?",
      answer: "Safari intentionally reports a generic renderer string so that pages cannot read the exact graphics model, which reduces fingerprinting.",
    },
    {
      question: "Why does my renderer mention SwiftShader?",
      answer: "SwiftShader is a software renderer. It means WebGL is running on the CPU, usually because hardware acceleration is off, the driver is blocked, or the browser runs in a virtual machine.",
    },
  ],
  sources: [
    { title: "MDN: WEBGL_debug_renderer_info", url: "https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_debug_renderer_info" },
    { title: "MDN: GPUAdapterInfo", url: "https://developer.mozilla.org/en-US/docs/Web/API/GPUAdapterInfo" },
    { title: "MDN: WebGPU API", url: "https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API" },
  ],
};

export default content;
