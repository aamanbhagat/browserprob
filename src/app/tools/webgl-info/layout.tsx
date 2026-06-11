import type { Metadata } from "next";
export const metadata: Metadata = { title: "WebGL Information — GPU & Graphics Test", description: "Check your WebGL support, GPU renderer, vendor string, and available extensions. Test WebGL 1.0 and 2.0 compatibility.", alternates: { canonical: "https://browserprobe.app/tools/webgl-info" } };
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
