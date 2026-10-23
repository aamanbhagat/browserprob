// Content-Security-Policy builders. Kept free of Next.js imports so next.config.ts, src/proxy.ts and
// the unit tests can all use them.

interface CspOptions {
  isDevelopment: boolean;
  /** upgrade-insecure-requests is only sent on Vercel; locally WebKit would rewrite asset URLs to https://localhost. */
  onVercel: boolean;
}

/** The policy for builds without ads: everything first-party, no third-party scripts at all. */
export function staticCsp({ isDevelopment, onVercel }: CspOptions): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    `connect-src 'self' stun:${isDevelopment ? " ws: wss:" : ""}`,
    "media-src 'self' blob:",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(onVercel ? ["upgrade-insecure-requests"] : []),
  ].join("; ");
}

/**
 * The policy for builds with ads, following Google's AdSense CSP guidance
 * (https://support.google.com/adsense/answer/16283098): a strict, nonce-based script-src with
 * 'strict-dynamic', object-src 'none' and base-uri 'none'. Google does not support domain allowlists
 * and warns that stricter policies may break ads, so no other fetch directives are restricted. The
 * extra directives below only govern how this site may be framed and where its forms submit, which do
 * not affect ad loading.
 */
export function adsCsp({ nonce, onVercel }: CspOptions & { nonce: string }): string {
  return [
    "object-src 'none'",
    `script-src 'nonce-${nonce}' 'unsafe-inline' 'unsafe-eval' 'strict-dynamic' https: http:`,
    "base-uri 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    ...(onVercel ? ["upgrade-insecure-requests"] : []),
  ].join("; ");
}

/** A random, base64-encoded nonce (128 bits), as the Next.js CSP guide generates it. */
export function createNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}
