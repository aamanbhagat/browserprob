import type { ToolContent } from "@/content/types";

const content: ToolContent = {
  sections: [
    {
      id: "measures",
      heading: "What this test measures",
      body: `Web pages can read several different sizes, and they are easy to mix up. This test shows them side by side:

- **Screen resolution:** the full size of the display, from \`screen.width\` and \`screen.height\`.
- **Available screen area:** the part not taken by the taskbar, dock or menu bar (\`screen.availWidth\` and \`availHeight\`).
- **Browser window (outer):** the whole window, including toolbars.
- **Viewport (inner):** the part of the window that shows the page, which is what responsive layouts react to.
- **Visual viewport:** the part currently visible after pinch-zoom, plus the zoom scale.
- **Device pixel ratio:** how many physical pixels make up one CSS pixel.

It also reports colour depth, colour gamut, HDR support, orientation and touch points, along with your display preferences: dark mode, reduced motion, contrast and forced colours.`,
    },
    {
      id: "how-it-works",
      heading: "How the values are read",
      body: `The sizes come straight from the \`screen\`, \`window\` and \`visualViewport\` objects. The colour and preference values come from CSS media queries run through \`matchMedia\`, such as \`(color-gamut: p3)\`, \`(dynamic-range: high)\` and \`(prefers-reduced-motion: reduce)\`. Wider colour gamuts also match the narrower queries, so the test checks from widest to narrowest and reports the first match.

The page listens for resize, orientation and zoom events and for changes to those media queries, and updates the values as they happen. Nothing is sent anywhere.`,
    },
    {
      id: "reading",
      heading: "How to read your result",
      body: `All sizes are in **CSS pixels**, the unit web pages lay out with, not physical pixels. A phone that reports 393 × 852 with a device pixel ratio of 3 has a panel of roughly 1179 × 2556 physical pixels. The "device pixels" row multiplies the two to estimate that.

A **device pixel ratio** of 1 is a classic standard-density display; 2 or 3 is typical of high-density "Retina" laptop and phone screens. Browser zoom changes this value. Zooming to 125% on a ratio-2 screen reports 2.5, and the CSS-pixel sizes shrink to match.

**Viewport** is smaller than the window because it excludes toolbars and, on most desktop systems, the scrollbar. **Color gamut "p3"** means the display can show wide-gamut colours. **Dynamic range "high"** means it reports HDR support.`,
    },
    {
      id: "limitations",
      heading: "Why these numbers can surprise you",
      body: `- **Scaling:** operating-system display scaling and browser zoom both change CSS-pixel sizes. A 2560-pixel-wide monitor at 150% scaling reports a screen width of about 1707.
- **Multiple monitors:** screen values describe the monitor the window is currently on, and they change when you drag the window to another one.
- **Browser protections:** some browsers deliberately adjust these values. When its fingerprinting protection is active, Firefox logs a console note that it is "altering screen.availWidth and screen.availHeight", and Tor Browser rounds the window to fixed steps.
- **Touch points:** a laptop with a touch screen and a tablet in a keyboard case can both report touch support. It describes the hardware, not how you are using it.`,
    },
    {
      id: "fixes",
      heading: "If a site gets your screen wrong",
      body: `- **Text or layout looks too big or too small:** check browser zoom first (Ctrl or Cmd plus 0 resets it), then your operating system's display scaling.
- **A site shows its mobile layout on a desktop:** your viewport is probably narrow. Widen the window, or check whether the zoom level is high.
- **For privacy:** a maximised window at a common resolution and zoom level is less distinctive than an odd window size. Browsers with fingerprinting protection, and Tor Browser's window rounding ("letterboxing"), standardise these values for you.`,
    },
  ],
  faq: [
    {
      question: "What is the difference between screen size and viewport size?",
      answer: "Screen size is the whole display, in CSS pixels. Viewport size is the part of the browser window that shows the page, so it excludes the browser's own toolbars and usually the scrollbar.",
    },
    {
      question: "What is device pixel ratio?",
      answer: "It is the number of physical screen pixels used to draw one CSS pixel. Standard displays have a ratio of 1; high-density laptop and phone screens usually report 2 or 3, and browser zoom changes the value.",
    },
    {
      question: "Why is my screen resolution lower than my monitor's specification?",
      answer: "Browsers report sizes in CSS pixels, which are scaled by your operating system's display scaling. Multiply the screen width by the device pixel ratio to estimate the physical resolution.",
    },
  ],
  sources: [
    { title: "MDN: Window.devicePixelRatio", url: "https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio" },
    { title: "MDN: Visual Viewport API", url: "https://developer.mozilla.org/en-US/docs/Web/API/Visual_Viewport_API" },
    { title: "MDN: color-gamut media feature", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/color-gamut" },
    { title: "MDN: prefers-reduced-motion media feature", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion" },
  ],
};

export default content;
