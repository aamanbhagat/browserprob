export interface JsFeature {
  name: string;
  /** ECMAScript (or ECMA-402 for Intl) edition that standardized the feature. */
  edition: string;
  supported: boolean;
}

type Check = { name: string; edition: string; test: () => boolean };

const has = (fn: () => unknown): boolean => {
  try {
    return Boolean(fn());
  } catch {
    return false;
  }
};

// Built-in objects and methods only. Syntax features (async/await, optional chaining, class fields)
// cannot be tested without eval, which this site's Content-Security-Policy forbids; if the page's own
// scripts run at all, the browser already parsed modern syntax.
const CHECKS: Check[] = [
  { name: "Promise", edition: "ES2015", test: () => typeof Promise === "function" },
  { name: "Map and Set", edition: "ES2015", test: () => typeof Map === "function" && typeof Set === "function" },
  { name: "Proxy and Reflect", edition: "ES2015", test: () => typeof Proxy === "function" && typeof Reflect === "object" },
  { name: "Object.entries", edition: "ES2017", test: () => typeof Object.entries === "function" },
  { name: "Promise.prototype.finally", edition: "ES2018", test: () => typeof Promise.prototype.finally === "function" },
  { name: "Array.prototype.flat", edition: "ES2019", test: () => typeof Array.prototype.flat === "function" },
  { name: "BigInt", edition: "ES2020", test: () => typeof BigInt === "function" },
  { name: "globalThis", edition: "ES2020", test: () => typeof globalThis === "object" },
  { name: "Promise.allSettled", edition: "ES2020", test: () => typeof Promise.allSettled === "function" },
  { name: "String.prototype.replaceAll", edition: "ES2021", test: () => typeof String.prototype.replaceAll === "function" },
  { name: "WeakRef", edition: "ES2021", test: () => typeof WeakRef === "function" },
  { name: "Array.prototype.at", edition: "ES2022", test: () => typeof Array.prototype.at === "function" },
  { name: "Object.hasOwn", edition: "ES2022", test: () => typeof Object.hasOwn === "function" },
  { name: "Error cause", edition: "ES2022", test: () => has(() => new Error("x", { cause: 1 }).cause === 1) },
  { name: "Array.prototype.findLast", edition: "ES2023", test: () => typeof Array.prototype.findLast === "function" },
  { name: "Array.prototype.toSorted", edition: "ES2023", test: () => typeof (Array.prototype as { toSorted?: unknown }).toSorted === "function" },
  { name: "Promise.withResolvers", edition: "ES2024", test: () => typeof (Promise as { withResolvers?: unknown }).withResolvers === "function" },
  { name: "Object.groupBy", edition: "ES2024", test: () => typeof (Object as { groupBy?: unknown }).groupBy === "function" },
  { name: "Set methods (union, intersection…)", edition: "ES2025", test: () => typeof (Set.prototype as { union?: unknown }).union === "function" },
  { name: "Iterator helpers", edition: "ES2025", test: () => has(() => typeof (globalThis as { Iterator?: { prototype?: { map?: unknown } } }).Iterator?.prototype?.map === "function") },
  { name: "Promise.try", edition: "ES2025", test: () => typeof (Promise as { try?: unknown }).try === "function" },
  { name: "RegExp.escape", edition: "ES2025", test: () => typeof (RegExp as { escape?: unknown }).escape === "function" },
  { name: "Intl.Segmenter", edition: "ECMA-402 (2022)", test: () => typeof (Intl as { Segmenter?: unknown }).Segmenter === "function" },
  { name: "Intl.ListFormat", edition: "ECMA-402 (2021)", test: () => typeof (Intl as { ListFormat?: unknown }).ListFormat === "function" },
];

export function detectJsFeatures(): JsFeature[] {
  return CHECKS.map(({ name, edition, test }) => ({ name, edition, supported: has(test) }));
}

/** Newest edition for which every listed feature is supported, e.g. "ES2023". */
export function newestCompleteEdition(features: JsFeature[]): string | null {
  const editions = [...new Set(features.filter((f) => f.edition.startsWith("ES")).map((f) => f.edition))].sort();
  let newest: string | null = null;
  for (const edition of editions) {
    if (features.filter((f) => f.edition === edition).every((f) => f.supported)) newest = edition;
    else break;
  }
  return newest;
}
