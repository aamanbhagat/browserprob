import type { ClientIpResult } from "@/lib/client-ip";

export interface IPInfo extends ClientIpResult {
  status: "ok" | "unavailable";
}

const unavailable: IPInfo = {
  ip: null,
  version: null,
  scope: null,
  rangeLabel: null,
  source: null,
  location: null,
  status: "unavailable",
};

export async function detectIP(): Promise<IPInfo> {
  try {
    const res = await fetch("/api/ip", {
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) throw new Error(`IP lookup returned ${res.status}`);
    const data = (await res.json()) as Partial<ClientIpResult>;
    if (!data.ip) return unavailable;
    return {
      ip: data.ip,
      version: data.version ?? null,
      scope: data.scope ?? null,
      rangeLabel: data.rangeLabel ?? null,
      source: data.source ?? null,
      location: data.location ?? null,
      status: "ok",
    };
  } catch {
    return unavailable;
  }
}

/** English country name for an ISO 3166-1 code, falling back to the code itself. */
export function countryName(code: string | null): string | null {
  if (!code) return null;
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}
