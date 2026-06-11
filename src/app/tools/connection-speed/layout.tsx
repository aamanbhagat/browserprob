import type { Metadata } from "next";
export const metadata: Metadata = { title: "Connection Information — Network Speed Test", description: "Check your connection type, estimated speed, round-trip time, and data saver mode using the Network Information API.", alternates: { canonical: "https://browserprobe.app/tools/connection-speed" } };
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
