import type { Metadata } from "next";
import Link from "next/link";
import ProsePage, { OwnerDetail } from "@/components/ProsePage";
import { ADS_ENABLED } from "@/lib/ads";
import { absoluteUrl, CONTACT_EMAIL, OWNER_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What BrowserProbe processes when you use it: tests that run in your browser, the IP endpoint, Cloudflare STUN for WebRTC, Vercel hosting logs and Google AdSense advertising.",
  alternates: { canonical: absoluteUrl("/privacy-policy") },
};

export default function PrivacyPolicyPage() {
  return (
    <ProsePage
      title="Privacy policy"
      intro="BrowserProbe is built so that your test results stay in your browser. This page explains every place where data does leave it, and who receives it."
      updated="2026-10-23"
    >
      <h2>Who is responsible</h2>
      <p>
        BrowserProbe (browserprobe.app) is run by <OwnerDetail value={OWNER_NAME} />. You can reach them through the{" "}
        <Link href="/contact">contact page</Link> or at <OwnerDetail value={CONTACT_EMAIL} />.
      </p>

      <h2>Summary</h2>
      <ul>
        <li>There are no accounts, sign-ups or forms, and the application does not store your test results.</li>
        <li>Most tests run entirely in your browser tab. Their results are displayed to you and are not sent anywhere.</li>
        <li>The IP address test sends one request to this site&apos;s server; the WebRTC test contacts Cloudflare&apos;s STUN server.</li>
        <li>Our hosting provider, Vercel, keeps standard request logs.</li>
        <li>{ADS_ENABLED ? "Pages show advertising from Google AdSense, which uses cookies as described below." : "The site is preparing to show advertising from Google AdSense; no advertising code runs yet. The advertising section below describes what will apply once it does."}</li>
      </ul>

      <h2>Tests that run in your browser</h2>
      <p>
        The browser, screen, time zone, storage, canvas, audio, font, WebGL, hardware, media-device, plugin, JavaScript and feature
        tests read values from your browser&apos;s APIs and display them in the page. BrowserProbe&apos;s code does not upload those
        results. If you copy, print or download a report from the home page, that happens on your device.
      </p>
      <p>
        The cookies and storage test writes test values (a cookie named <code>_bp_probe</code>, local and session storage entries,
        an IndexedDB database and a cache) and deletes each one immediately. The media-devices test only asks for camera or
        microphone access if you press &quot;Show device names&quot;; it stops the devices immediately and records nothing.
      </p>

      <h2>The IP address endpoint</h2>
      <p>
        The IP address test, the WebRTC test, the time zone test and the home page check request <code>/api/ip</code> on this site.
        The server reads the IP address your request came from, plus an approximate country, region, city and time zone that our
        hosting provider derives from that address, and returns them to your browser. The application does not write them to a
        database, does not contact any other service to look them up, and the response is marked as not cacheable.
      </p>

      <h2>WebRTC test and Cloudflare</h2>
      <p>
        The WebRTC leak test, and the WebRTC part of the home page check, make your browser send STUN requests to Cloudflare&apos;s
        public STUN server (<code>stun.cloudflare.com</code>). A STUN server necessarily sees the IP address and port the requests
        come from; that is how it can tell your browser its public address. Cloudflare processes this under its own privacy policy.
        BrowserProbe does not receive the result from Cloudflare.
      </p>

      <h2>Hosting and request logs</h2>
      <p>
        BrowserProbe is hosted on Vercel. Like any web host, Vercel processes the IP address, requested URL, time, user-agent and
        similar request details to deliver pages, protect against abuse and produce logs, which are retained for a limited period.
        See <a href="https://vercel.com/legal/privacy-notice">Vercel&apos;s privacy policy</a>. BrowserProbe uses these logs only
        to operate and secure the site and does not combine them with test results, which it never receives.
      </p>

      <h2 id="advertising">Advertising (Google AdSense)</h2>
      {!ADS_ENABLED && (
        <p>
          <strong>Current status: no advertising code is loaded.</strong> The rest of this section applies once ads are switched
          on, and this page will say so when that happens.
        </p>
      )}
      <p>
        BrowserProbe {ADS_ENABLED ? "uses" : "will use"} Google AdSense to show ads on tool pages and guides. When ads are shown:
      </p>
      <ul>
        <li>Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this website or other websites.</li>
        <li>Google&apos;s use of advertising cookies enables it and its partners to serve ads to you based on your visit to this site and/or other sites on the internet.</li>
        <li>Google receives information such as your IP address, browser details and the page you are viewing. See <a href="https://policies.google.com/technologies/partner-sites">How Google uses information from sites or apps that use its services</a>.</li>
        <li>You can opt out of personalized advertising by visiting Google&apos;s <a href="https://www.google.com/settings/ads">Ads Settings</a>. You can opt out of some third-party vendors&apos; use of cookies for personalized advertising at <a href="https://www.aboutads.info/choices/">www.aboutads.info</a>.</li>
        <li>Visitors in the European Economic Area, the United Kingdom and Switzerland are asked for consent through a Google-certified consent management platform before personalized ads or related cookies are used. You can change your choice at any time with the &quot;Privacy &amp; ad choices&quot; link in the site footer.</li>
      </ul>
      <p>
        The <Link href="/advertising-and-cookies">advertising and cookies page</Link> lists what is stored in your browser and how
        to control it.
      </p>

      <h2>Analytics</h2>
      <p>BrowserProbe does not use analytics or tracking scripts.</p>

      <h2>Your rights</h2>
      <p>
        Because the application keeps no accounts or test results, it holds no personal data about you beyond the hosting
        provider&apos;s request logs. You can ask questions or make a request about your data through the{" "}
        <Link href="/contact">contact page</Link>. For data held by Vercel, Cloudflare or Google, those companies can be contacted
        directly through the policies linked above.
      </p>

      <h2>Children</h2>
      <p>BrowserProbe is a general-audience technical site and is not directed at children under 13.</p>

      <h2>Changes</h2>
      <p>
        This policy is updated whenever the site&apos;s data handling changes, for example when advertising is switched on or a test
        starts contacting a new service. The date at the top shows the latest revision.
      </p>
    </ProsePage>
  );
}
