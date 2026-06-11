import type { Metadata } from "next";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About BrowserProbe",
  description: "BrowserProbe is a free, open-source suite of browser diagnostics and privacy tools. Learn about our mission and how we help protect your online privacy.",
  alternates: { canonical: "https://browserprobe.app/about" },
};

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>About Browser<span className="gradient-text">Probe</span></h1>

        <div className={styles.content}>
          <p>BrowserProbe is a free suite of online tools that reveals what information your browser exposes to the websites you visit. Our mission is simple: <strong>help people understand and control their digital privacy</strong>.</p>

          <h2>Why We Built This</h2>
          <p>Every time you visit a website, your browser shares dozens of data points — your screen resolution, GPU model, installed fonts, timezone, and much more. Individually, these seem harmless. Combined, they create a unique &quot;fingerprint&quot; that can track you across the internet without cookies.</p>
          <p>Most people have no idea how much data their browser reveals. BrowserProbe makes this visible.</p>

          <h2>Our Principles</h2>
          <ul>
            <li><strong>100% Client-Side</strong> — All detection runs in your browser. We don&apos;t send your data to any server (except the IP tool, which only reads request headers).</li>
            <li><strong>No Tracking</strong> — We don&apos;t use analytics, cookies, or any form of user tracking on this site.</li>
            <li><strong>Free Forever</strong> — Every tool is completely free with no signup required.</li>
            <li><strong>Educational</strong> — Each tool includes explanations of what the data means and how to protect yourself.</li>
          </ul>

          <h2>How It Works</h2>
          <p>BrowserProbe uses standard browser APIs (Canvas, WebGL, AudioContext, Navigator, etc.) to detect information that any website could access. We don&apos;t exploit vulnerabilities or use any techniques that require special permissions.</p>
          <p>The same APIs we use for detection are the same ones advertisers, analytics companies, and fingerprinting services use to track you. By showing you what&apos;s exposed, we help you make informed decisions about your browser settings and privacy tools.</p>

          <h2>Technology</h2>
          <p>BrowserProbe is built with Next.js and deployed on modern infrastructure for maximum speed. The site is fully static where possible, with client-side detection running only when you visit a tool page.</p>
        </div>
      </div>
    </div>
  );
}
