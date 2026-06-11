import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "What Is My IP Address? — IP Lookup",
  description: "Check your public IP address instantly. BrowserProbe reveals your IPv4/IPv6 address and connection details. Free, fast, no signup required.",
  alternates: { canonical: "https://browserprobe.app/tools/what-is-my-ip" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
