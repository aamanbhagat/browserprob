export interface BrandVersion {
  brand: string;
  version: string;
}

export interface ClientHintsInfo {
  supported: boolean;
  /** Low-entropy values available without a request (also sent as Sec-CH-UA, -Mobile, -Platform headers). */
  brands: BrandVersion[];
  mobile: boolean | null;
  platform: string;
  /** High-entropy values the browser returned from getHighEntropyValues(). */
  highEntropy: Partial<Record<HighEntropyHint, string>>;
  /** Hints the page asked for that came back missing or empty. */
  withheld: HighEntropyHint[];
  error: string | null;
}

export const HIGH_ENTROPY_HINTS = [
  "architecture",
  "bitness",
  "formFactors",
  "fullVersionList",
  "model",
  "platformVersion",
  "wow64",
] as const;

export type HighEntropyHint = (typeof HIGH_ENTROPY_HINTS)[number];

interface UADataLike {
  brands?: BrandVersion[];
  mobile?: boolean;
  platform?: string;
  getHighEntropyValues?: (hints: string[]) => Promise<Record<string, unknown>>;
}

/** GREASE brands such as "Not)A;Brand" exist to stop sites from parsing an exact list; they carry no information. */
export function isGreaseBrand(brand: string): boolean {
  return /not.?a.?brand/i.test(brand);
}

export function formatHintValue(hint: HighEntropyHint, value: unknown): string {
  if (value === undefined || value === null || value === "") return "";
  if (hint === "fullVersionList" && Array.isArray(value)) {
    return (value as BrandVersion[])
      .filter((item) => !isGreaseBrand(item.brand))
      .map((item) => `${item.brand} ${item.version}`)
      .join(", ");
  }
  if (hint === "formFactors" && Array.isArray(value)) return value.join(", ");
  if (hint === "wow64") return value ? "Yes" : "No";
  return String(value);
}

export async function readClientHints(uaData: UADataLike | undefined): Promise<ClientHintsInfo> {
  if (!uaData) {
    return { supported: false, brands: [], mobile: null, platform: "", highEntropy: {}, withheld: [], error: null };
  }

  const base: ClientHintsInfo = {
    supported: true,
    brands: (uaData.brands || []).filter((item) => !isGreaseBrand(item.brand)),
    mobile: typeof uaData.mobile === "boolean" ? uaData.mobile : null,
    platform: uaData.platform || "",
    highEntropy: {},
    withheld: [],
    error: null,
  };

  if (typeof uaData.getHighEntropyValues !== "function") return { ...base, withheld: [...HIGH_ENTROPY_HINTS] };

  try {
    const values = await uaData.getHighEntropyValues([...HIGH_ENTROPY_HINTS]);
    for (const hint of HIGH_ENTROPY_HINTS) {
      const formatted = formatHintValue(hint, values[hint]);
      // An empty model is normal on desktop; any empty value is reported as withheld rather than guessed.
      if (formatted) base.highEntropy[hint] = formatted;
      else base.withheld.push(hint);
    }
    return base;
  } catch (error) {
    return { ...base, withheld: [...HIGH_ENTROPY_HINTS], error: error instanceof Error ? error.name : "Error" };
  }
}

export function detectClientHints(): Promise<ClientHintsInfo> {
  return readClientHints((navigator as Navigator & { userAgentData?: UADataLike }).userAgentData);
}
