export interface IPInfo {
  ip: string;
  ipv4: string;
  ipv6: string;
  source: "server" | "unavailable";
}

export async function detectIP(): Promise<IPInfo> {
  try {
    const res = await fetch("/api/ip", {
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) throw new Error(`IP lookup returned ${res.status}`);
    const data = (await res.json()) as Partial<IPInfo>;
    return {
      ip: data.ip || "Unable to detect",
      ipv4: data.ipv4 || "Not detected",
      ipv6: data.ipv6 || "Not detected",
      source: "server",
    };
  } catch {
    return {
      ip: "Unable to detect",
      ipv4: "Not detected",
      ipv6: "Not detected",
      source: "unavailable",
    };
  }
}
