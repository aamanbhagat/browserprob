import type { Metadata } from "next";
import Link from "next/link";
import ProsePage from "@/components/ProsePage";
import { absoluteUrl, SOURCE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms for using BrowserProbe's free browser tests and guides: what the results are for, acceptable use of the site and its IP endpoint, and the limits of liability.",
  alternates: { canonical: absoluteUrl("/terms") },
};

export default function TermsPage() {
  return (
    <ProsePage
      title="Terms of use"
      intro="By using browserprobe.app you agree to these terms. They are short because the service is simple: free tests and explanations, with no accounts."
      updated="2026-10-23"
    >
      <h2>What BrowserProbe provides</h2>
      <p>
        BrowserProbe offers browser diagnostic tests and explanatory guides, free of charge. The tests report what your browser and
        connection reveal at the moment you run them. They are informational: they are not a security audit, legal advice, or a
        guarantee that a VPN, browser setting or privacy tool protects you.
      </p>

      <h2>No warranty</h2>
      <p>
        The site is provided &quot;as is&quot;. Browsers change frequently and some values they report can be rounded, frozen or
        deliberately altered, so results may be incomplete or out of date. To the extent permitted by law, BrowserProbe is not liable
        for decisions made on the basis of a test result or guide.
      </p>

      <h2>Acceptable use</h2>
      <ul>
        <li>Use the site for its intended purpose: checking your own browser and learning how browsers work.</li>
        <li>Do not overload the site or its <code>/api/ip</code> endpoint with automated requests, and do not try to disrupt or gain unauthorized access to the service.</li>
        <li>Do not use the site to test devices or networks you are not authorized to test.</li>
      </ul>

      <h2>Content and code</h2>
      <p>
        The text and design of the site belong to BrowserProbe unless stated otherwise. The source code is published on{" "}
        <a href={SOURCE_URL}>GitHub</a>. You are welcome to link to any page and to quote short passages with attribution.
      </p>

      <h2>Third-party services and links</h2>
      <p>
        Some tests rely on third-party infrastructure, such as Cloudflare&apos;s STUN server for the WebRTC test, and pages may show
        advertising from Google. Guides link to external documentation. Those services and sites have their own terms and privacy
        policies; see the <Link href="/privacy-policy">privacy policy</Link> and the{" "}
        <Link href="/advertising-and-cookies">advertising and cookies page</Link>.
      </p>

      <h2>Changes</h2>
      <p>
        These terms may be updated when the service changes. The date at the top shows the latest version; continued use after a
        change means you accept the updated terms. Questions can be sent through the <Link href="/contact">contact page</Link>.
      </p>
    </ProsePage>
  );
}
