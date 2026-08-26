"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const Header = dynamic(() => import("@/components/Header"));
const Footer = dynamic(() => import("@/components/Footer"));

export default function SiteChrome({ position }: { position: "header" | "footer" }) {
  const pathname = usePathname();

  if (pathname === "/") return null;

  return position === "header" ? <Header /> : <Footer />;
}
