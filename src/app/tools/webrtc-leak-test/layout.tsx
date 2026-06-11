import type { Metadata } from "next";
export const metadata: Metadata = { title: "WebRTC Leak Test — IP Leak Checker", description: "Test for WebRTC IP leaks that can expose your real IP address even when using a VPN. Free WebRTC leak test with fix instructions.", alternates: { canonical: "https://browserprobe.app/tools/webrtc-leak-test" } };
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
