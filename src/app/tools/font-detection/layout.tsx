import type { Metadata } from "next";
export const metadata: Metadata = { title: "Font Detection — Installed Fonts Test", description: "Detect which fonts are installed on your system through your browser. See how font detection contributes to browser fingerprinting.", alternates: { canonical: "https://browserprobe.app/tools/font-detection" } };
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
