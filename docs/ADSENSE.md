# Google AdSense: how ads are wired and what to do in the dashboard

Ads are **off by default**. With the flag off, the site loads no ad code. It still publishes:

- `public/ads.txt`, containing the Google seller line only;
- the `google-adsense-account` meta tag, which is Google's site-ownership tag and loads nothing.

## How it works in the code

| Piece | File | What it does |
|---|---|---|
| Flag and IDs | `src/lib/ads.ts` | `NEXT_PUBLIC_ADS_ENABLED` must be exactly `true`. Publisher ID `ca-pub-1720101320139769` (a unit test checks it against `public/ads.txt`). Slot IDs come from env vars. |
| Loader | `src/app/layout.tsx` | With ads on, `next/script` loads `adsbygoogle.js?client=…` after hydration, with the request's CSP nonce. |
| CSP | `src/lib/csp.ts`, `src/proxy.ts`, `next.config.ts` | Ads off: static first-party CSP. Ads on: `proxy.ts` sets Google's strict, nonce-based CSP per request (see below), and the static CSP is not sent. |
| Ad units | `src/components/ads/AdSlot.tsx` | Labelled "Advertisement", fixed 250 px height set inline (no layout shift). Renders nothing unless the flag is on **and** the slot has an ID. |
| Placement | `ToolPage.tsx`, `blog/[slug]/page.tsx`, `app/page.tsx` | Tool pages: after "How to read your result" and before the FAQ. Guides: one between sections near the middle, one after the sources. Home: one after the test directory. Never on about, contact, privacy, terms, advertising-and-cookies, error or 404 pages, never above results, never next to buttons. |
| Consent link | `src/components/ads/ConsentChoicesLink.tsx` | Footer "Privacy & ad choices" button that calls Google's `googlefc.showRevocationMessage()`. It only appears after Google's consent API reports ready. |

### Content Security Policy with ads

Google supports **only** a strict nonce-based CSP for AdSense and says stricter policies may break ads: [AdSense help: Content Security Policy](https://support.google.com/adsense/answer/16283098). When ads are on, every page response gets:

```
object-src 'none'; script-src 'nonce-{random}' 'unsafe-inline' 'unsafe-eval' 'strict-dynamic' https: http:;
base-uri 'none'; frame-ancestors 'none'; form-action 'self'; upgrade-insecure-requests
```

`upgrade-insecure-requests` is only added on Vercel. No domains are allowlisted. Next.js applies the nonce to its own scripts automatically.

**Trade-off:** nonces need a fresh response per request, so with ads on, every HTML page is rendered on demand instead of served statically from the CDN. Expect more Vercel function invocations and a slightly higher time to first byte. With ads off, pages stay static.

Google suggests trying the policy in report-only mode first. Set `ADS_CSP_REPORT_ONLY=true` to send `Content-Security-Policy-Report-Only` instead.

### Other headers with ads on

- **COEP:** none is sent; the site was never cross-origin isolated.
- **COOP:** switches from `same-origin` to `same-origin-allow-popups`. This is a precaution so that ad-click windows opened from Google's frames keep normal behavior. Google does not document a COOP requirement for AdSense.

## What you need to do

1. **Wait for approval.** Keep `ads.txt` and the meta tag live (both are deployed with ads off).
2. **Consent (EEA, UK, Switzerland).** Google requires a Google-certified CMP that supports the IAB TCF before it serves personalized ads to visitors in the EEA and UK (since 16 January 2024) and Switzerland (since 31 July 2024): [AdSense help: CMP requirements](https://support.google.com/adsense/answer/13554020). The simplest option is Google's own:
   - AdSense → **Privacy & messaging** → **European regulations** → create a message for browserprobe.app, choose your consent options, and publish it.
   - This repo does **not** contain a homemade consent banner, and must not get one that claims TCF compliance.
3. **US state privacy laws.** Privacy & messaging → **US state regulations** → create and publish the message. It adds Google's "Do not sell or share my personal information" link for visitors in the states that require it.
4. **Turn Auto ads off** for browserprobe.app (Ads → By site). The placement rules above only hold for the manual units. Auto ads, anchor ads and vignettes would place ads where the code does not control them.
5. **Create five display ad units** (Ads → By ad unit → Display ads). Suggested names: Tool middle, Tool end, Guide middle, Guide end, Home. Copy each unit's `data-ad-slot` number.
6. **Set environment variables in Vercel** (Production), then **redeploy**. `NEXT_PUBLIC_*` values are read at build time.
   ```
   NEXT_PUBLIC_ADS_ENABLED=true
   NEXT_PUBLIC_ADSENSE_SLOT_TOOL_MIDDLE=…
   NEXT_PUBLIC_ADSENSE_SLOT_TOOL_END=…
   NEXT_PUBLIC_ADSENSE_SLOT_GUIDE_MIDDLE=…
   NEXT_PUBLIC_ADSENSE_SLOT_GUIDE_END=…
   NEXT_PUBLIC_ADSENSE_SLOT_HOME=…
   ADS_CSP_REPORT_ONLY=true   # optional for the first deploy; remove once the console shows no violations
   ```
7. **Check the live site.** In the browser console there should be no CSP violations. From an EEA location (or a VPN), the consent message should appear, and the footer should show "Privacy & ad choices".
8. **Re-check AdSense → Policy center** after the first days of serving.

## Testing locally

```bash
# Ads off (default): no Google requests at all.
npm run build && npm run test:e2e

# Ads on, real loader, no ad units: CSP and nonce checks against Google's script.
NEXT_PUBLIC_ADS_ENABLED=true npm run build
E2E_ADS=1 npx playwright test e2e/ads.spec.ts

# Slot layout (placeholder slot IDs in a local build only; every Google request is stubbed).
NEXT_PUBLIC_ADS_ENABLED=true NEXT_PUBLIC_ADSENSE_SLOT_TOOL_MIDDLE=1000000001 NEXT_PUBLIC_ADSENSE_SLOT_TOOL_END=1000000002 \
NEXT_PUBLIC_ADSENSE_SLOT_GUIDE_MIDDLE=1000000003 NEXT_PUBLIC_ADSENSE_SLOT_GUIDE_END=1000000004 NEXT_PUBLIC_ADSENSE_SLOT_HOME=1000000005 \
npm run build
E2E_ADS=1 E2E_ADS_SLOTS=1 npx playwright test e2e/ads.spec.ts
```

Real ads cannot be tested before approval: Google will not fill units for an unapproved site or for localhost.
