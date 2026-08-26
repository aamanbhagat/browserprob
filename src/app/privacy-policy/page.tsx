import type { Metadata } from "next";
import styles from "../about/about.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "BrowserProbe privacy method: what runs locally, when network services are contacted, and how diagnostic results are handled.",
  alternates: { canonical: "https://browserprobe.app/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>Privacy Policy</h1>
        <div className={styles.content}>
          <p><strong>Last updated:</strong> August 27, 2026</p>

          <h2>The Short Version</h2>
          <p>BrowserProbe does not require an account or store the assembled diagnostic report in an application database. Most tests run in the current tab. The site does load a third-party monetization script and service-worker code; those providers receive ordinary request metadata and their code runs in the browser context.</p>

          <h2>Diagnostic Results</h2>
          <p>Browser, display, storage, graphics, font, audio, and feature checks are computed in your browser. BrowserProbe does not include application code that uploads or persists the assembled report. If you choose to copy, print, or download a report, that action happens on your device.</p>

          <h2>IP Address Tool</h2>
          <p>The &quot;What Is My IP&quot; tool sends one request to BrowserProbe&apos;s IP endpoint. The server reads the connection address from infrastructure-provided request headers and returns it to the tab. The application does not write that result to a database. Hosting and network providers may still process standard access logs under their own operational and security policies.</p>

          <h2>WebRTC Test</h2>
          <p>The WebRTC test contacts Cloudflare&apos;s public STUN service at <code>stun.cloudflare.com</code> so the browser can gather ICE candidates. A STUN provider necessarily observes the network address making that request. BrowserProbe displays the candidates in the tab and does not send the completed comparison back to the application server.</p>

          <h2>Cookies</h2>
          <p>BrowserProbe does not use account cookies. The cookie test creates a temporary first-party test cookie and immediately deletes it, and storage tests similarly create and remove temporary values. Third-party monetization code may use cookies or browser storage according to the provider&apos;s own configuration and policies.</p>

          <h2>Third-Party Services</h2>
          <p>BrowserProbe loads a monetization tag from <code>quge5.com</code> using zone <code>273538</code>. The provider-supplied <code>/sw.js</code> imports service-worker code from <code>3nbf4.com</code> using zone <code>11662682</code>. Third-party JavaScript and service workers can process connection metadata, browser characteristics, page context, interactions, and storage identifiers under the provider&apos;s own policies. The WebRTC test also uses Cloudflare&apos;s public STUN service as described above. Links to GitHub open only when selected.</p>

          <h2>Data Sharing</h2>
          <p>BrowserProbe application code does not intentionally upload or sell the assembled diagnostic report. Because third-party monetization code executes on the same page, BrowserProbe cannot promise that page-visible values or browser metadata are inaccessible to that provider. Hosting, advertising, DNS, and network providers process connection metadata as necessary to deliver their services.</p>

          <h2>Changes to This Policy</h2>
          <p>We will update this page when the site&apos;s diagnostic, storage, or third-party service behavior changes.</p>

          <h2>Contact</h2>
          <p>If you have questions about this privacy policy, please reach out through our website.</p>
        </div>
      </div>
    </div>
  );
}
