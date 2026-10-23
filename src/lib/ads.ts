// Google AdSense configuration. Ads stay off unless NEXT_PUBLIC_ADS_ENABLED is exactly "true" at build time.
export const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";

// Publisher ID from public/ads.txt (a test keeps the two in sync).
export const ADSENSE_CLIENT = "ca-pub-1720101320139769";
