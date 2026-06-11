import type { Metadata } from "next";
export const metadata: Metadata = { title: "Browser Plugins & Extensions — Plugin Detector", description: "Check what browser plugins and MIME types are detectable by websites. See PDF viewer support and plugin-based fingerprinting.", alternates: { canonical: "https://browserprobe.app/tools/browser-plugins" } };
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
