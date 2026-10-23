import type { Metadata } from "next";
import Link from "next/link";
import ProsePage, { OwnerDetail } from "@/components/ProsePage";
import { ADS_ENABLED } from "@/lib/ads";
import { absoluteUrl, OWNER_NAME, SOURCE_URL } from "@/lib/site";
import { tools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "About BrowserProbe and How It Tests",
  description: "Who runs BrowserProbe, how its browser tests work, how results and guides are checked against sources, how the site is funded, and how to report a mistake.",
  alternates: { canonical: absoluteUrl("/about") },
};

export default function AboutPage() {
  return (
    <ProsePage
      title="About BrowserProbe"
      intro="BrowserProbe is a free set of browser tests that shows what any website can read about your browser, device and network connection, and explains what each result does and does not prove."
      updated="2026-10-23"
    >
      <h2>Who runs it</h2>
      <p>
        BrowserProbe is an independent project run by <OwnerDetail value={OWNER_NAME} />. It is not affiliated with any browser
        vendor, VPN provider or advertising company. The source code is public on <a href={SOURCE_URL}>GitHub</a>, so anyone can
        check how each test works. Questions and corrections are welcome through the <Link href="/contact">contact page</Link>.
      </p>

      <h2>What the site is for</h2>
      <p>
        Websites can read a surprising amount about the browser you use, mostly for good reasons: picking a layout for your screen,
        choosing your language, working around a graphics-driver bug. The same values can also be combined to recognize a browser
        without cookies. BrowserProbe shows you those values in plain language so you can see what is exposed, check whether a
        privacy setting or VPN works as expected, or debug a site that misbehaves.
      </p>

      <h2 id="method">How the tests work</h2>
      <p>
        There are {tools.length} tests, each on its own page. Almost all of them run entirely inside your browser tab and use the
        same web APIs any other page could use, such as <code>navigator</code>, <code>screen</code>, <code>Intl</code>, Canvas,
        Web Audio, WebGL and WebRTC. There are two exceptions:
      </p>
      <ul>
        <li>The IP address test, and checks that compare against your IP, make one request to this site&apos;s own <code>/api/ip</code> endpoint, which reads the address your request came from.</li>
        <li>The WebRTC test sends STUN requests to Cloudflare&apos;s public STUN server, because that is how WebRTC discovers addresses.</li>
      </ul>
      <p>BrowserProbe follows a few rules when it reports a result:</p>
      <ul>
        <li><strong>Only real readings.</strong> Every value comes from an API call in your browser or from your own request. When an API does not exist, the page says &quot;Not supported in this browser&quot; instead of guessing.</li>
        <li><strong>No invented scores.</strong> There is no privacy or uniqueness score. Judging how rare a configuration is needs data about a large population, which a single visit cannot provide.</li>
        <li><strong>Limits stated next to results.</strong> Each test page has a section on false positives and on what the result cannot tell you.</li>
        <li><strong>Nothing stored.</strong> The application does not save your results. The home page check only runs when you click the button.</li>
      </ul>

      <h2>How the explanations are checked</h2>
      <p>
        Tool pages and <Link href="/blog">guides</Link> are written from the test code and from primary sources: browser-vendor
        documentation, MDN Web Docs, W3C and WHATWG specifications, IETF RFCs and the IANA registries. Each page lists its sources
        and the date it was last reviewed. Browser behavior changes often; if something here is out of date, please{" "}
        <Link href="/contact">report it</Link> and it will be corrected and the review date updated.
      </p>

      <h2>How the site is funded</h2>
      <p>
        {ADS_ENABLED
          ? "BrowserProbe is free to use and is funded by advertising served by Google AdSense on tool pages and guides. Ads are labelled \"Advertisement\" and are kept away from test controls."
          : "BrowserProbe is free to use. It is preparing to show advertising served by Google AdSense on tool pages and guides to cover hosting costs; at the moment no advertising code runs on the site."}{" "}
        Advertisers have no influence over test results or explanations, and BrowserProbe never sells or shares your test results.
        The <Link href="/advertising-and-cookies">advertising and cookies page</Link> explains how ads use cookies and how to opt
        out.
      </p>
    </ProsePage>
  );
}
