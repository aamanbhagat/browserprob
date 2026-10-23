export type ProbeResult = "works" | "blocked" | "not-supported";

export interface StorageInfo {
  /** navigator.cookieEnabled: the browser's own claim, before any write is attempted. */
  cookieEnabledFlag: boolean;
  firstPartyCookie: ProbeResult;
  localStorage: ProbeResult;
  sessionStorage: ProbeResult;
  indexedDB: ProbeResult;
  cacheStorage: ProbeResult;
  /** Bytes, from navigator.storage.estimate(); null when not supported. */
  usage: number | null;
  quota: number | null;
  persisted: boolean | null;
}

const PROBE_KEY = "_bp_probe";

export function formatBytes(bytes: number | null): string {
  if (bytes === null || !Number.isFinite(bytes) || bytes < 0) return "Not reported";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value >= 10 || unit === 0 ? Math.round(value) : value.toFixed(1)} ${units[unit]}`;
}

function probeCookie(): ProbeResult {
  try {
    document.cookie = `${PROBE_KEY}=1; Path=/; SameSite=Lax`;
    const written = document.cookie.split(";").some((item) => item.trim() === `${PROBE_KEY}=1`);
    document.cookie = `${PROBE_KEY}=; Max-Age=0; Path=/; SameSite=Lax`;
    return written ? "works" : "blocked";
  } catch {
    return "blocked";
  }
}

function probeWebStorage(kind: "localStorage" | "sessionStorage"): ProbeResult {
  let store: Storage;
  try {
    store = window[kind];
    if (!store) return "not-supported";
  } catch {
    // Accessing the property itself throws when storage is disabled.
    return "blocked";
  }
  try {
    store.setItem(PROBE_KEY, "1");
    const ok = store.getItem(PROBE_KEY) === "1";
    store.removeItem(PROBE_KEY);
    return ok ? "works" : "blocked";
  } catch {
    return "blocked";
  }
}

function probeIndexedDB(): Promise<ProbeResult> {
  if (typeof indexedDB === "undefined") return Promise.resolve("not-supported");
  const name = `${PROBE_KEY}_db`;
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve("blocked"), 3000);
    const done = (result: ProbeResult) => {
      clearTimeout(timer);
      resolve(result);
    };
    try {
      const request = indexedDB.open(name, 1);
      request.onupgradeneeded = () => request.result.createObjectStore("probe");
      request.onsuccess = () => {
        try {
          const db = request.result;
          const tx = db.transaction("probe", "readwrite");
          tx.objectStore("probe").put("1", "key");
          tx.oncomplete = () => {
            db.close();
            indexedDB.deleteDatabase(name);
            done("works");
          };
          tx.onerror = () => {
            db.close();
            indexedDB.deleteDatabase(name);
            done("blocked");
          };
        } catch {
          done("blocked");
        }
      };
      request.onerror = () => done("blocked");
    } catch {
      done("blocked");
    }
  });
}

async function probeCacheStorage(): Promise<ProbeResult> {
  if (typeof caches === "undefined") return "not-supported";
  const name = `${PROBE_KEY}_cache`;
  try {
    await caches.open(name);
    await caches.delete(name);
    return "works";
  } catch {
    return "blocked";
  }
}

export async function detectStorage(): Promise<StorageInfo> {
  let usage: number | null = null;
  let quota: number | null = null;
  let persisted: boolean | null = null;
  try {
    if (navigator.storage?.estimate) {
      const estimate = await navigator.storage.estimate();
      usage = estimate.usage ?? null;
      quota = estimate.quota ?? null;
    }
    if (navigator.storage?.persisted) persisted = await navigator.storage.persisted();
  } catch {
    // Some private modes reject StorageManager calls.
  }

  const [indexed, cacheStorage] = await Promise.all([probeIndexedDB(), probeCacheStorage()]);

  return {
    cookieEnabledFlag: navigator.cookieEnabled,
    firstPartyCookie: probeCookie(),
    localStorage: probeWebStorage("localStorage"),
    sessionStorage: probeWebStorage("sessionStorage"),
    indexedDB: indexed,
    cacheStorage,
    usage,
    quota,
    persisted,
  };
}

export const PROBE_LABELS: Record<ProbeResult, string> = {
  works: "Works",
  blocked: "Blocked",
  "not-supported": "Not supported in this browser",
};
