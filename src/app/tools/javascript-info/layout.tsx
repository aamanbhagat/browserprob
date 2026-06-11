import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "JavaScript Detection — JS Feature Test",
  description: "Test if JavaScript is enabled in your browser. Check support for ES6+, Web Workers, Service Workers, WebAssembly, and modern JS features.",
  alternates: { canonical: "https://browserprobe.app/tools/javascript-info" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
