import type { Metadata } from "next";
import styles from "../about/about.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "BrowserProbe privacy policy. We don't track you, store your data, or use cookies. All browser detection runs client-side.",
  alternates: { canonical: "https://browserprobe.app/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>Privacy Policy</h1>
        <div className={styles.content}>
          <p><strong>Last updated:</strong> June 2025</p>

          <h2>The Short Version</h2>
          <p>We don&apos;t track you. We don&apos;t store your data. All browser detection runs entirely in your browser.</p>

          <h2>What Data We Collect</h2>
          <p><strong>None.</strong> BrowserProbe does not collect, store, or transmit any personal data. All browser detection and fingerprint generation happens client-side in your browser. Results are never sent to our servers.</p>

          <h2>IP Address Tool</h2>
          <p>The &quot;What Is My IP&quot; tool reads your IP address from standard HTTP request headers (x-forwarded-for, x-real-ip). This information is not stored or logged. It is returned to your browser and discarded immediately.</p>

          <h2>Cookies</h2>
          <p>BrowserProbe does not set any cookies. We do not use analytics cookies, tracking cookies, or advertising cookies.</p>

          <h2>Third-Party Services</h2>
          <p>We do not use any third-party analytics, advertising, or tracking services. We do not embed any third-party scripts that could track your behavior.</p>

          <h2>Data Sharing</h2>
          <p>We do not share any data with third parties because we do not collect any data in the first place.</p>

          <h2>Changes to This Policy</h2>
          <p>If we ever change our privacy practices, we will update this page. Since we don&apos;t collect data, we don&apos;t anticipate significant changes.</p>

          <h2>Contact</h2>
          <p>If you have questions about this privacy policy, please reach out through our website.</p>
        </div>
      </div>
    </div>
  );
}
