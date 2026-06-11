import type { Metadata } from "next";
export const metadata: Metadata = { title: "Media Devices Detection — Camera & Mic Check", description: "Detect available media devices (cameras, microphones, speakers) in your browser without accessing them. Free media devices tool.", alternates: { canonical: "https://browserprobe.app/tools/media-devices" } };
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
