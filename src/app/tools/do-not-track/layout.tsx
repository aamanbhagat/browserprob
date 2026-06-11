import type { Metadata } from "next";
export const metadata: Metadata = { title: "Do Not Track Test — DNT & GPC Check", description: "Test if Do Not Track (DNT) and Global Privacy Control (GPC) are enabled in your browser. Learn about their effectiveness and privacy impact.", alternates: { canonical: "https://browserprobe.app/tools/do-not-track" } };
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
