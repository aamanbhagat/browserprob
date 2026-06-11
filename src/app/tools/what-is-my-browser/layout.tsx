import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What Is My Browser? — Browser Detector",
  description:
    "Find out what browser you are using. BrowserProbe detects your browser name, version, rendering engine (Blink, Gecko, WebKit), and full user agent string instantly.",
  keywords: ["what is my browser", "browser detector", "check browser version", "user agent string"],
  alternates: { canonical: "https://browserprobe.app/tools/what-is-my-browser" },
  openGraph: {
    title: "What Is My Browser? — BrowserProbe",
    description: "Instantly detect your browser name, version, rendering engine, and user agent string.",
    url: "https://browserprobe.app/tools/what-is-my-browser",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
