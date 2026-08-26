"use client";

import { useState, useEffect } from "react";
import DataRow from "@/components/DataRow";
import ToolLoading from "@/components/ToolLoading";
import RelatedTools from "@/components/RelatedTools";
import { detectIP, type IPInfo } from "@/lib/detect/ip";
import styles from "../tools.module.css";

export default function WhatIsMyIPPage() {
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);

  useEffect(() => {
    detectIP().then(setIpInfo);
  }, []);

  if (!ipInfo) return <ToolLoading title="What Is My IP Address?" />;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://browserprobe.app/tools/what-is-my-ip#webapp",
        "name": "What Is My IP Address?",
        "url": "https://browserprobe.app/tools/what-is-my-ip",
        "description": "Discover your public IP address and connection details instantly.",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Any"
      },
      {
        "@type": "FAQPage",
        "@id": "https://browserprobe.app/tools/what-is-my-ip#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is the difference between IPv4 and IPv6?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "IPv4 addresses are 32-bit numeric values (e.g., 192.168.1.1), while IPv6 addresses are 128-bit hexadecimal values (e.g., 2001:db8::1) designed to accommodate the vastly growing number of internet devices."
            }
          },
          {
            "@type": "Question",
            "name": "Can a website see my actual IP address if I use a VPN?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "If your VPN is working correctly, websites should only see the VPN server's public IP address. However, if your browser has WebRTC leaks enabled, it might still expose your real local or public IP address."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className={styles.toolPage}>
      <div className="container">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
        />
        <div className={styles.header}>
          <span className={styles.icon}>📡</span>
          <h1 className={styles.title}>What Is My IP Address?</h1>
          <p className={styles.subtitle}>Your public IP address as seen by websites you visit.</p>
        </div>
        <div className={styles.resultsCard}>
          <div className={styles.resultsHeader}>
            <span className={styles.resultsTitle}>Your IP Info</span>
            <span className={styles.statusDot} />
          </div>
          <DataRow label="Primary IP" value={ipInfo.ip} />
          <DataRow label="Public IPv4" value={ipInfo.ipv4} />
          <DataRow label="Public IPv6" value={ipInfo.ipv6} />
        </div>
        <div className={styles.explainer}>
          <h2 className={styles.explainerTitle}>What This Means</h2>
          <p className={styles.explainerText}>
            Your <strong>public IP address</strong> identifies a network route, not necessarily one device or person. It may be shared by a household, workplace, mobile carrier, VPN, or carrier-grade NAT gateway.
          </p>
          <p className={styles.explainerText}>
            <strong>IPv4</strong> addresses look like <code>192.168.1.1</code> and are the most common format. <strong>IPv6</strong> addresses are longer (like <code>2001:db8::1</code>) and were created because the world is running out of IPv4 addresses.
          </p>
          <p className={styles.explainerText}>
            If you&apos;re using a <strong>VPN</strong>, compare this result with the exit address shown by your VPN provider. BrowserProbe cannot independently know which address you expected, so it does not automatically declare a VPN failure.
          </p>
        </div>
        <RelatedTools currentSlug="what-is-my-ip" />
      </div>
    </div>
  );
}
