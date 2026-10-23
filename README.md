# BrowserProbe

BrowserProbe ([browserprobe.app](https://browserprobe.app)) is a set of free browser tests. Each one shows what any website can read about the current browser, device and network connection, and explains what the result does and does not prove.

## What it checks

- **Identity and network:** browser, engine and the reduced user-agent string; User-Agent Client Hints; public IP address and its range; time zone and locale; WebRTC ICE candidates compared with the page's IP.
- **Privacy and fingerprinting:** first-party cookies and storage; canvas and Web Audio samples (with a per-read randomization check); font detection; Do Not Track and Global Privacy Control.
- **Hardware and display:** screen, viewport and pixel ratio; WebGL and WebGPU; CPU threads, rounded memory and battery; media devices; Navigation Timing and Network Information.
- **Features:** JavaScript status and ES2015–ES2025 built-ins; web platform APIs; `navigator.plugins` and inline PDF support.

Each tool page is server-rendered. It explains how the test works, how to read the result and what its limitations are, and lists its sources. Browser-reported values can be rounded, frozen, randomized or spoofed, so the site reports evidence and never a uniqueness or privacy score.

## Privacy and network behavior

Most checks run in the current tab. The IP check calls the first-party `/api/ip` route, which reads the request address and Vercel's location headers. It stores nothing and contacts no other service. The WebRTC check contacts Cloudflare's public STUN server. The application has no accounts and stores no reports. The in-product privacy policy covers hosting logs and advertising.

`public/sw.js` is a kill-switch service worker. It removes a third-party push worker that an earlier ad integration registered in visitors' browsers. **Keep it deployed until at least 2027-01-23.** No code registers a service worker.

## Local development

Requires a current Node.js release compatible with Next.js 16.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verification

```bash
npm run lint
npm run typecheck
npm test                 # Vitest: detection logic, IP ranges, CSP, content and SEO invariants
npm run build
npm run test:e2e         # Playwright: every route in Chromium, Firefox, WebKit and mobile Chromium
npm audit
```

The end-to-end suite starts `next start` on port 3100 (or reuses a running server). Install the browsers once with `npx playwright install`. The smoke tests require zero console errors, zero axe WCAG 2.2 AA violations and no third-party requests on every route. A crawl checks that every internal link resolves.

## Advertising

Google AdSense is wired in but **off by default** (`NEXT_PUBLIC_ADS_ENABLED`). See [docs/ADSENSE.md](docs/ADSENSE.md) for how it works, the strict nonce-based CSP it uses when switched on, and the dashboard steps (consent message, ad units, environment variables).

## Production

The app uses the Next.js App Router and deploys to Vercel:

```bash
npm run build
npm start
```

Responses include:

- a Content Security Policy;
- HSTS;
- `X-Frame-Options: DENY`;
- a strict referrer policy;
- `Cross-Origin-Opener-Policy`;
- `Cross-Origin-Resource-Policy`;
- a `Permissions-Policy` that disables geolocation, payment, USB and Bluetooth.

There is no `Cross-Origin-Embedder-Policy`, so the site is not cross-origin isolated.

`upgrade-insecure-requests` is only sent on Vercel. Locally, WebKit would rewrite asset URLs to `https://localhost`.
