export interface ScreenInfo {
  screenWidth: number;
  screenHeight: number;
  availWidth: number;
  availHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  outerWidth: number;
  outerHeight: number;
  /** visualViewport size and pinch-zoom scale, when supported. */
  visualViewport: { width: number; height: number; scale: number } | null;
  devicePixelRatio: number;
  colorDepth: number;
  pixelDepth: number;
  orientation: string;
  touchSupport: boolean;
  maxTouchPoints: number;
  colorGamut: string;
  dynamicRange: string;
  colorScheme: string;
  reducedMotion: string;
  contrast: string;
  forcedColors: string;
}

function firstMatchingQuery(feature: string, values: string[], fallback = "No preference / not reported"): string {
  if (typeof matchMedia !== "function") return "Not supported";
  for (const value of values) {
    if (matchMedia(`(${feature}: ${value})`).matches) return value;
  }
  return fallback;
}

export function detectScreen(): ScreenInfo {
  const vv = window.visualViewport;
  return {
    screenWidth: screen.width,
    screenHeight: screen.height,
    availWidth: screen.availWidth,
    availHeight: screen.availHeight,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    outerWidth: window.outerWidth,
    outerHeight: window.outerHeight,
    visualViewport: vv ? { width: Math.round(vv.width), height: Math.round(vv.height), scale: Math.round(vv.scale * 100) / 100 } : null,
    devicePixelRatio: window.devicePixelRatio || 1,
    colorDepth: screen.colorDepth,
    pixelDepth: screen.pixelDepth,
    orientation: screen.orientation?.type || "Unknown",
    touchSupport: "ontouchstart" in window || navigator.maxTouchPoints > 0,
    maxTouchPoints: navigator.maxTouchPoints || 0,
    // Wider gamuts also match the narrower queries, so test from widest to narrowest.
    colorGamut: firstMatchingQuery("color-gamut", ["rec2020", "p3", "srgb"], "Below sRGB / not reported"),
    dynamicRange: firstMatchingQuery("dynamic-range", ["high", "standard"], "Not reported"),
    colorScheme: firstMatchingQuery("prefers-color-scheme", ["dark", "light"]),
    reducedMotion: firstMatchingQuery("prefers-reduced-motion", ["reduce"], "no-preference"),
    contrast: firstMatchingQuery("prefers-contrast", ["more", "less", "custom"], "no-preference"),
    forcedColors: firstMatchingQuery("forced-colors", ["active"], "none"),
  };
}
