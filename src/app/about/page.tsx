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
          <p>BrowserProbe is a free, open-source suite of browser diagnostics that explains what a web page can observe in the current session. Our mission is simple: <strong>show the evidence, label the uncertainty, and avoid making claims the browser cannot prove</strong>.</p>

          <h2>Why We Built This</h2>
          <p>Every time you visit a website, your browser exposes data such as screen dimensions, graphics capabilities, available fonts, and timezone. Combined across a large population and over time, those signals may support probabilistic tracking without cookies.</p>
          <p>Most people have no idea how much data their browser reveals. BrowserProbe makes this visible.</p>

          <h2>Our Principles</h2>
          <ul>
            <li><strong>Local by Default</strong> — Most probes run in the tab. The public IP check necessarily reaches our endpoint, and the WebRTC test uses a public STUN endpoint to gather ICE candidates.</li>
            <li><strong>Third-Party Services Disclosed</strong> — Monetization and network providers are identified in the privacy policy so their role is not hidden.</li>
            <li><strong>No Report Storage</strong> — BrowserProbe does not send the assembled diagnostic report back to the application server.</li>
            <li><strong>Free Forever</strong> — Every tool is completely free with no signup required.</li>
            <li><strong>Evidence-Based</strong> — Each finding includes a source, limitation, or confidence label where interpretation is required.</li>
          </ul>

          <h2>How It Works</h2>
          <p>BrowserProbe uses standard browser APIs (Canvas, WebGL, AudioContext, Navigator, etc.) to detect information that any website could access. We don&apos;t exploit vulnerabilities or use any techniques that require special permissions.</p>
          <p>The same APIs can support legitimate web features or contribute to fingerprinting when combined at scale. A single sample does not prove uniqueness. BrowserProbe shows the signals and explains what can reasonably be inferred from them.</p>

          <h2>Technology</h2>
          <p>BrowserProbe is built with Next.js and is fully static where possible. The source and detection methods are available in the public project repository so results can be inspected and challenged.</p>
        </div>
      </div>
    </div>
  );
}
