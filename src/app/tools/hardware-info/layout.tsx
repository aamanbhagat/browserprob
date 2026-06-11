import type { Metadata } from "next";
export const metadata: Metadata = { title: "Hardware Information — CPU, Memory, GPU & Battery", description: "Check your device hardware through your browser: CPU cores, device memory, battery status, and GPU information.", alternates: { canonical: "https://browserprobe.app/tools/hardware-info" } };
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
