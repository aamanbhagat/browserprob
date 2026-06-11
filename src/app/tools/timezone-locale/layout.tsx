import type { Metadata } from "next";
export const metadata: Metadata = { title: "Timezone & Locale — Browser Timezone Detector", description: "Check your browser timezone, locale, language preferences, and date formatting. See how timezone data contributes to fingerprinting.", alternates: { canonical: "https://browserprobe.app/tools/timezone-locale" } };
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
