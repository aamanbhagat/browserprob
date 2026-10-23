import type { ToolContent } from "@/content/types";

const content: ToolContent = {
  sections: [
    {
      id: "what-this-means",
      heading: "What this means",
      body: "**JavaScript** is the programming language that makes websites interactive. Without it, most modern websites would display only static content.\n\n**Web Workers** allow JavaScript to run in background threads, enabling complex computations without freezing the UI. **Service Workers** enable offline functionality and push notifications.\n\n**WebAssembly** (Wasm) allows browsers to run near-native-speed code, powering demanding applications like video editors and games directly in the browser.",
    },
  ],
  faq: [
    { question: "Why do websites require JavaScript to be enabled?", answer: "JavaScript is a client-side programming language that drives page interactivity, handles asynchronous data fetches, controls rich media elements, and powers dynamic user interfaces." },
    { question: "What is WebAssembly (Wasm)?", answer: "WebAssembly (Wasm) is a binary instruction format designed for a stack-based virtual machine in the browser. It enables near-native execution speed for languages like C, C++, and Rust, supporting high-performance games, simulators, and media editors." },
  ],
  sources: [],
};

export default content;
