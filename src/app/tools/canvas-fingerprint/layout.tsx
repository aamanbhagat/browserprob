import type { Metadata } from "next";
export const metadata: Metadata = { title: "Canvas Fingerprint Test — Rendering Sample", description: "Generate a stable ID for one canvas rendering sample and understand what the result can—and cannot—show about browser fingerprinting.", alternates: { canonical: "https://browserprobe.app/tools/canvas-fingerprint" } };
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
