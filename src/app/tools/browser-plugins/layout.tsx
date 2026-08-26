import type { Metadata } from "next";
export const metadata: Metadata = { title: "Browser Plugins & PDF Support", description: "Inspect the browser's reduced plugins API, MIME types, and PDF viewer capability. This test cannot list installed extensions.", alternates: { canonical: "https://browserprobe.app/tools/browser-plugins" } };
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
