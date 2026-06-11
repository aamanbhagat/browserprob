import type { Metadata } from "next";
export const metadata: Metadata = { title: "Cookies Test — Browser Cookie Checker", description: "Test if cookies are enabled in your browser. Check first-party cookie support, localStorage, sessionStorage, and IndexedDB.", alternates: { canonical: "https://browserprobe.app/tools/cookies-test" } };
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
