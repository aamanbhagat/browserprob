# BrowserProbe

BrowserProbe is an evidence-based browser diagnostics site. It creates a local “Diagnostic Passport” that separates browser-reported facts from interpretations and explicitly labels confidence and limitations.

## What it checks

- Browser, engine, platform, language, user agent, and Client Hints
- Public request IP and WebRTC ICE candidates
- Screen, viewport, graphics, hardware, storage, and media-device visibility
- Canvas and Web Audio rendering samples
- Privacy preference signals including DNT and GPC
- Support for selected browser APIs

Browser-reported values can be reduced, frozen, randomized, or spoofed. A single scan cannot verify a physical device, prove fingerprint uniqueness, or guarantee anonymity.

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
npm test
npm run build
npm audit
```

The unit suite covers browser parsing, Client Hint brand filtering, IP normalization and classification, timezone offsets, WebRTC candidate interpretation, sample hashing, and diagnostic findings.

## Privacy and network behavior

Most checks run in the current tab. The public-IP check calls the first-party `/api/ip` route. The WebRTC check contacts Cloudflare’s public STUN endpoint to gather ICE candidates. BrowserProbe does not require accounts or include application-level report storage. The site loads the supplied `quge5.com` zone `273538` monetization tag and the supplied root worker for `3nbf4.com` zone `11662682`. The in-product privacy policy describes this network behavior and its implications.

Hosting and infrastructure providers may still process ordinary request metadata. See the in-product privacy policy for the complete disclosure.

## Production

The app uses the Next.js App Router and is suitable for a standard Node or Vercel deployment:

```bash
npm run build
npm start
```

Production responses include a Content Security Policy, HSTS, clickjacking protection, a strict referrer policy, and cross-origin isolation headers. Re-run the test suite, dependency audit, and browser checks before each release.
