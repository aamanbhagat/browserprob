import { classifyIpAddress, describeIpRange, getIpVersion, unwrapIpv4Mapped, type IpScope } from "@/lib/ip";

export interface IpLocationHint {
  country: string | null;
  region: string | null;
  city: string | null;
  timezone: string | null;
}

export interface ClientIpResult {
  /** The address the request arrived from, with IPv4-mapped IPv6 unwrapped, or null if none was usable. */
  ip: string | null;
  version: 4 | 6 | null;
  scope: IpScope | null;
  /** Human-readable range name for non-public addresses (for example "Loopback (this device)"). */
  rangeLabel: string | null;
  /** The request header the address came from. */
  source: string | null;
  /** Approximate location from the hosting provider's IP database, when it supplies one. */
  location: IpLocationHint | null;
}

type HeaderReader = { get(name: string): string | null };

// On Vercel these headers are set by the platform and client-supplied values are overwritten,
// so the first entry is the connecting client. Order: most specific first.
const ADDRESS_HEADERS = ["x-vercel-forwarded-for", "x-forwarded-for", "x-real-ip"] as const;

function firstAddress(value: string | null): string | null {
  if (!value) return null;
  for (const candidate of value.split(",")) {
    const address = unwrapIpv4Mapped(candidate);
    if (getIpVersion(address)) return address;
  }
  return null;
}

function decodeHeader(value: string | null): string | null {
  if (!value) return null;
  try {
    const decoded = decodeURIComponent(value).trim();
    return decoded || null;
  } catch {
    return value.trim() || null;
  }
}

export function readLocationHint(headers: HeaderReader): IpLocationHint | null {
  const hint: IpLocationHint = {
    country: decodeHeader(headers.get("x-vercel-ip-country")),
    region: decodeHeader(headers.get("x-vercel-ip-country-region")),
    city: decodeHeader(headers.get("x-vercel-ip-city")),
    timezone: decodeHeader(headers.get("x-vercel-ip-timezone")),
  };
  return Object.values(hint).some(Boolean) ? hint : null;
}

export function resolveClientIp(headers: HeaderReader): ClientIpResult {
  for (const name of ADDRESS_HEADERS) {
    const ip = firstAddress(headers.get(name));
    if (!ip) continue;
    return {
      ip,
      version: getIpVersion(ip),
      scope: classifyIpAddress(ip),
      rangeLabel: describeIpRange(ip),
      source: name,
      location: readLocationHint(headers),
    };
  }
  return { ip: null, version: null, scope: null, rangeLabel: null, source: null, location: null };
}
