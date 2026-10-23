// Google AdSense configuration. Ads stay off unless NEXT_PUBLIC_ADS_ENABLED is exactly "true" at build
// time. Every process.env access is written out in full so Next.js can inline it into client code.
export const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";

// Publisher ID from public/ads.txt (a test keeps the two in sync).
export const ADSENSE_CLIENT = "ca-pub-1720101320139769";

export const ADSENSE_SCRIPT_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;

/** Ad unit IDs are created in the AdSense dashboard after approval; a slot without an ID renders nothing. */
export function parseSlotId(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed && /^\d{6,}$/.test(trimmed) ? trimmed : null;
}

export const AD_SLOTS = {
  toolMiddle: parseSlotId(process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL_MIDDLE),
  toolEnd: parseSlotId(process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL_END),
  guideMiddle: parseSlotId(process.env.NEXT_PUBLIC_ADSENSE_SLOT_GUIDE_MIDDLE),
  guideEnd: parseSlotId(process.env.NEXT_PUBLIC_ADSENSE_SLOT_GUIDE_END),
  home: parseSlotId(process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME),
} as const;
