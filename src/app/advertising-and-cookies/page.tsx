import type { Metadata } from "next";
import Link from "next/link";
import ProsePage from "@/components/ProsePage";
import { ADS_ENABLED } from "@/lib/ads";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Advertising and Cookies",
  description: "Which cookies and browser storage BrowserProbe and Google AdSense use, how advertising consent works in the EEA, UK and Switzerland, and how to opt out of personalized ads.",
  alternates: { canonical: absoluteUrl("/advertising-and-cookies") },
};

export default function AdvertisingAndCookiesPage() {
  return (
    <ProsePage
      title="Advertising and cookies"
      intro="What BrowserProbe stores in your browser (almost nothing), what advertising cookies are used when ads are shown, and how you stay in control."
      updated="2026-10-23"
    >
      <h2>Current status</h2>
      <p>
        {ADS_ENABLED
          ? "Ads from Google AdSense are shown on tool pages and guides. They are always labelled \"Advertisement\". Pages about the site itself (this page, the privacy policy, terms, about and contact) never show ads."
          : "No advertising code is currently loaded on BrowserProbe. The site is preparing to show ads from Google AdSense on tool pages and guides; when that starts, this page will be updated and the details below will apply."}
      </p>

      <h2>What BrowserProbe itself stores</h2>
      <p>BrowserProbe&apos;s own code does not set lasting cookies or keep anything in your browser&apos;s storage. Some tests write a value and delete it within the same moment:</p>
      <table>
        <thead>
          <tr><th scope="col">Name or type</th><th scope="col">Used by</th><th scope="col">How long</th></tr>
        </thead>
        <tbody>
          <tr><td><code>_bp_probe</code> cookie, localStorage and sessionStorage entries</td><td>Cookies and storage test, home page check</td><td>Deleted immediately after reading it back</td></tr>
          <tr><td><code>_bp_probe_db</code> IndexedDB database, <code>_bp_probe_cache</code> cache</td><td>Cookies and storage test, home page check</td><td>Deleted immediately</td></tr>
        </tbody>
      </table>
      <p>
        The site also removes a service worker and its caches that an earlier advertising integration (removed in October 2026)
        may have left in your browser.
      </p>

      <h2>Advertising cookies (Google AdSense)</h2>
      <p>
        When ads are shown, Google and its advertising partners may set and read cookies and similar identifiers in your browser,
        to show ads, limit how often you see the same ad, measure performance and prevent fraud, and, where you allow it, to
        personalize ads based on your visits to this and other websites. Google describes this in{" "}
        <a href="https://policies.google.com/technologies/partner-sites">How Google uses information from sites or apps that use its services</a>{" "}
        and in its <a href="https://policies.google.com/technologies/ads">advertising technologies</a> page.
      </p>

      <h2>Consent in the EEA, UK and Switzerland</h2>
      <p>
        If you visit from the European Economic Area, the United Kingdom or Switzerland, a consent message from a Google-certified
        consent management platform asks for your choices before personalized advertising cookies are used. If you decline, Google
        can still show non-personalized ads, which rely on limited data such as the page content and your approximate location.
        You can reopen the message and change your decision at any time with the &quot;Privacy &amp; ad choices&quot; link in the
        footer, which appears on every page while ads are active.
      </p>

      <h2>Opting out of personalized ads</h2>
      <ul>
        <li>Google&apos;s <a href="https://www.google.com/settings/ads">Ads Settings</a> lets you turn off ad personalization from Google.</li>
        <li><a href="https://www.aboutads.info/choices/">www.aboutads.info</a> lets you opt out of personalized advertising by participating companies.</li>
        <li>Your browser&apos;s settings let you block or delete cookies, including third-party cookies. The <Link href="/blog/cookies-storage-partitioning">guide to cookies and storage</Link> explains how each browser handles them.</li>
      </ul>

      <h2>Where ads appear</h2>
      <p>
        Ads are placed between sections of tool pages and guides, labelled &quot;Advertisement&quot;, with space reserved so the page
        does not jump while they load. They are never placed above test results, next to buttons, or on the error, privacy, terms,
        about, contact and advertising pages.
      </p>
    </ProsePage>
  );
}
