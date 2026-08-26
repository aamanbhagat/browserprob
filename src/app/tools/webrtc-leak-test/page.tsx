"use client";
import { useState, useEffect } from "react";
import { detectWebRTCLeak, type WebRTCLeak } from "@/lib/detect/privacy";
import { detectIP, type IPInfo } from "@/lib/detect/ip";
import DataRow from "@/components/DataRow";
import ToolLoading from "@/components/ToolLoading";
import RelatedTools from "@/components/RelatedTools";
import styles from "../tools.module.css";

export default function WebRTCLeakTestPage() {
  const [data, setData] = useState<{ rtc: WebRTCLeak; ip: IPInfo } | null>(null);
  useEffect(() => {
    Promise.all([detectWebRTCLeak(), detectIP()]).then(([rtc, ip]) => setData({ rtc, ip }));
  }, []);
  if (!data) return <ToolLoading title="WebRTC Address Test" />;
  const { rtc, ip } = data;
  const knownPublicAddresses = new Set([ip.ip, ip.ipv4, ip.ipv6]);
  const unexpectedPublicAddresses = rtc.publicIPs.filter((address) => !knownPublicAddresses.has(address));
  const comparison = rtc.privateIPs.length > 0
    ? "Review: a numeric local address is visible"
    : unexpectedPublicAddresses.length > 0
      ? "Compare: another public address or address family was observed"
      : rtc.publicIPs.length > 0
        ? "Public WebRTC address matches the detected IP"
        : rtc.mdnsProtected
          ? "Local addresses are masked with mDNS"
          : rtc.summary;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://browserprobe.app/tools/webrtc-leak-test#webapp",
        "name": "WebRTC Leak Test",
        "url": "https://browserprobe.app/tools/webrtc-leak-test",
        "description": "Inspect WebRTC ICE candidates and compare observed addresses with your detected public IP.",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Any"
      },
      {
        "@type": "FAQPage",
        "@id": "https://browserprobe.app/tools/webrtc-leak-test#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is a WebRTC IP leak?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A WebRTC leak is a mismatch between the network address a privacy tool is expected to expose and an address revealed in WebRTC ICE candidates. A public candidate by itself is not proof of a VPN leak; it must be compared with the expected VPN exit address."
            }
          },
          {
            "@type": "Question",
            "name": "How do I fix a WebRTC leak?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "First confirm that the observed address differs from the exit address expected from your VPN or proxy. If it does, review the VPN client's WebRTC protection, browser privacy settings, or enterprise policy before disabling WebRTC entirely."
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
      <div className={styles.header}><span className={styles.icon}>🔓</span><h1 className={styles.title}>WebRTC Address Test</h1><p className={styles.subtitle}>Inspect ICE candidates and compare them with the public IP visible to this site.</p></div>
      <div className={styles.resultsCard}>
        <div className={styles.resultsHeader}><span className={styles.resultsTitle}>WebRTC Results</span><span className={styles.statusDot} /></div>
        <DataRow label="WebRTC Supported" value={rtc.supported} />
        <DataRow label="Detected Public IP" value={ip.ip} />
        <DataRow label="WebRTC Public Addresses" value={rtc.publicIPs.length > 0 ? rtc.publicIPs.join(", ") : "None observed"} />
        <DataRow label="WebRTC Local Addresses" value={rtc.privateIPs.length > 0 ? rtc.privateIPs.join(", ") : "None observed"} />
        <DataRow label="mDNS Masking" value={rtc.mdnsProtected} />
        <DataRow label="Interpretation" value={comparison} mono={false} />
        <DataRow label="Raw Status" value={rtc.status.replaceAll("-", " ")} mono={false} />
      </div>
      <div className={styles.explainer}>
        <h2 className={styles.explainerTitle}>What This Means</h2>
        <p className={styles.explainerText}><strong>WebRTC</strong> (Web Real-Time Communication) uses ICE candidates to establish peer-to-peer connections. Modern browsers often mask local addresses with mDNS, while a STUN service can still produce a public network candidate.</p>
        <p className={styles.explainerText}>A public candidate that matches the IP already visible to the site is <strong>not automatically a leak</strong>. A meaningful VPN check requires comparing the observed address with the exit address your VPN says it is using.</p>
        <p className={styles.explainerText}>A different IPv4 and IPv6 address can still describe the same connection. Treat a mismatch as a prompt to compare with your provider—not proof of bypass on its own.</p>
        <p className={styles.explainerText}>This test contacts Cloudflare&apos;s public STUN endpoint to gather candidates. Review the raw addresses and comparison above before changing WebRTC or VPN settings.</p>
      </div>
      <RelatedTools currentSlug="webrtc-leak-test" />
    </div></div>
  );
}
