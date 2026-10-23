import type { Metadata } from "next";
import Link from "next/link";
import ProsePage, { OwnerDetail } from "@/components/ProsePage";
import { absoluteUrl, CONTACT_EMAIL, ISSUES_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact BrowserProbe",
  description: "How to report a wrong result, suggest a correction to a guide, ask a privacy question or get in touch with the person who runs BrowserProbe.",
  alternates: { canonical: absoluteUrl("/contact") },
};

export default function ContactPage() {
  const hasEmail = !CONTACT_EMAIL.startsWith("TODO(owner)");
  return (
    <ProsePage
      title="Contact"
      intro="Found a result that looks wrong, an explanation that is out of date, or have a question about your data? Here is how to reach the person who runs BrowserProbe."
      updated="2026-10-23"
    >
      <h2>Email</h2>
      <p>
        Write to <OwnerDetail value={CONTACT_EMAIL} href={hasEmail ? `mailto:${CONTACT_EMAIL}` : undefined} />. Use this for
        privacy requests, questions about advertising, and anything you would rather not post publicly.
      </p>

      <h2>Bug reports and corrections</h2>
      <p>
        Problems with a test, and corrections to the guides, can also be filed publicly as an issue on the project&apos;s{" "}
        <a href={ISSUES_URL}>GitHub repository</a>. Issues are public, so do not include your IP address or anything else you
        would rather keep private. Helpful details are:
      </p>
      <ul>
        <li>the page address (for example <code>/tools/webrtc-leak-test</code>);</li>
        <li>your browser and version, which the <Link href="/tools/what-is-my-browser">What Is My Browser test</Link> shows;</li>
        <li>what you expected to see and what you saw instead;</li>
        <li>for corrections to a guide, a link to the documentation or specification that shows the correct behavior.</li>
      </ul>

      <h2>Privacy requests</h2>
      <p>
        BrowserProbe&apos;s application does not keep accounts or store test results, so in most cases there is nothing to export or
        delete. The <Link href="/privacy-policy">privacy policy</Link> explains what the hosting provider logs and what advertising
        partners may collect, and how to contact them directly.
      </p>
    </ProsePage>
  );
}
