import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Screen Resolution Test — Display Information",
  description: "Test your screen resolution, viewport size, device pixel ratio, and color depth. See exactly how websites see your display.",
  alternates: { canonical: "https://browserprobe.app/tools/screen-resolution" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
