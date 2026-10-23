export type IpVersion = 4 | 6 | null;
export type IpScope = "public" | "private" | "loopback" | "link-local" | "reserved" | "invalid";

export function normalizeIpAddress(input: string | null | undefined): string {
  if (!input) return "";

  let value = input.trim().replace(/^for=/i, "").replace(/^"|"$/g, "");
  if (value.startsWith("[")) {
    const closingBracket = value.indexOf("]");
    if (closingBracket > 0) value = value.slice(1, closingBracket);
  } else if (/^\d{1,3}(?:\.\d{1,3}){3}:\d+$/.test(value)) {
    value = value.slice(0, value.lastIndexOf(":"));
  }

  const zoneIndex = value.indexOf("%");
  if (zoneIndex >= 0) value = value.slice(0, zoneIndex);
  return value.toLowerCase();
}

export function isValidIpv4(input: string): boolean {
  const parts = normalizeIpAddress(input).split(".");
  return parts.length === 4 && parts.every((part) => {
    if (!/^\d{1,3}$/.test(part)) return false;
    const number = Number(part);
    return number >= 0 && number <= 255 && String(number) === part;
  });
}

export function isValidIpv6(input: string): boolean {
  const value = normalizeIpAddress(input);
  if (!value.includes(":")) return false;
  if ((value.match(/::/g) || []).length > 1) return false;

  const [leftPart, rightPart = ""] = value.split("::");
  const left = leftPart ? leftPart.split(":") : [];
  const right = rightPart ? rightPart.split(":") : [];
  const groups = [...left, ...right];

  let groupCount = 0;
  for (const group of groups) {
    if (group.includes(".")) {
      if (!isValidIpv4(group)) return false;
      groupCount += 2;
    } else {
      if (!/^[0-9a-f]{1,4}$/i.test(group)) return false;
      groupCount += 1;
    }
  }

  return value.includes("::") ? groupCount < 8 : groupCount === 8;
}

export function getIpVersion(input: string): IpVersion {
  if (isValidIpv4(input)) return 4;
  if (isValidIpv6(input)) return 6;
  return null;
}

/**
 * Returns the embedded IPv4 address for IPv4-mapped IPv6 input (`::ffff:192.0.2.1`), otherwise the
 * normalized input. Proxies and dual-stack sockets often report IPv4 clients in this form.
 */
export function unwrapIpv4Mapped(input: string | null | undefined): string {
  const value = normalizeIpAddress(input);
  const dotted = value.match(/^(?:0{0,4}:){0,5}:?ffff:(\d{1,3}(?:\.\d{1,3}){3})$/);
  if (dotted && isValidIpv4(dotted[1])) return dotted[1];
  const hex = value.match(/^(?:0{0,4}:){0,5}:?ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/);
  if (hex) {
    const high = parseInt(hex[1], 16);
    const low = parseInt(hex[2], 16);
    return [high >> 8, high & 255, low >> 8, low & 255].join(".");
  }
  return value;
}

interface SpecialRange {
  scope: Exclude<IpScope, "public" | "invalid">;
  label: string;
}

// Ranges from the IANA IPv4 and IPv6 Special-Purpose Address Registries that are not globally reachable.
function specialIpv4Range(value: string): SpecialRange | null {
  const [a, b, c] = value.split(".").map(Number);
  if (a === 0) return { scope: "reserved", label: "“This network” (RFC 791)" };
  if (a === 10) return { scope: "private", label: "Private network (RFC 1918)" };
  if (a === 100 && b >= 64 && b <= 127) return { scope: "reserved", label: "Carrier-grade NAT shared space (RFC 6598)" };
  if (a === 127) return { scope: "loopback", label: "Loopback (this device)" };
  if (a === 169 && b === 254) return { scope: "link-local", label: "Link-local (RFC 3927)" };
  if (a === 172 && b >= 16 && b <= 31) return { scope: "private", label: "Private network (RFC 1918)" };
  if (a === 192 && b === 0 && c === 0) return { scope: "reserved", label: "IETF protocol assignments (RFC 6890)" };
  if (a === 192 && b === 0 && c === 2) return { scope: "reserved", label: "Documentation range (RFC 5737)" };
  if (a === 192 && b === 88 && c === 99) return { scope: "reserved", label: "Deprecated 6to4 relay anycast (RFC 7526)" };
  if (a === 192 && b === 168) return { scope: "private", label: "Private network (RFC 1918)" };
  if (a === 198 && (b === 18 || b === 19)) return { scope: "reserved", label: "Benchmarking (RFC 2544)" };
  if (a === 198 && b === 51 && c === 100) return { scope: "reserved", label: "Documentation range (RFC 5737)" };
  if (a === 203 && b === 0 && c === 113) return { scope: "reserved", label: "Documentation range (RFC 5737)" };
  if (a >= 224 && a <= 239) return { scope: "reserved", label: "Multicast" };
  if (a >= 240) return { scope: "reserved", label: "Reserved or broadcast" };
  return null;
}

/** Expands a valid IPv6 literal into its eight 16-bit groups. */
export function expandIpv6(input: string): number[] | null {
  const value = normalizeIpAddress(input);
  if (!isValidIpv6(value)) return null;
  const toGroups = (part: string): number[] => {
    if (!part) return [];
    return part.split(":").flatMap((group) => {
      if (!group.includes(".")) return [parseInt(group, 16)];
      const [a, b, c, d] = group.split(".").map(Number);
      return [(a << 8) | b, (c << 8) | d];
    });
  };
  const [left, right] = value.includes("::") ? value.split("::") : [value, undefined];
  const head = toGroups(left);
  if (right === undefined) return head;
  const tail = toGroups(right);
  return [...head, ...new Array(8 - head.length - tail.length).fill(0), ...tail];
}

function specialIpv6Range(value: string): SpecialRange | null {
  const g = expandIpv6(value);
  if (!g) return null;
  const allZeroUntil = (index: number) => g.slice(0, index).every((group) => group === 0);
  if (allZeroUntil(7) && g[7] === 1) return { scope: "loopback", label: "Loopback (this device)" };
  if (allZeroUntil(8)) return { scope: "reserved", label: "Unspecified address" };
  if (g[0] === 0x64 && g[1] === 0xff9b && g[2] === 1) return { scope: "reserved", label: "Local-use IPv4/IPv6 translation (RFC 8215)" };
  if (g[0] === 0x100 && g[1] === 0 && g[2] === 0 && g[3] === 0) return { scope: "reserved", label: "Discard-only block (RFC 6666)" };
  if (g[0] === 0x100 && g[1] === 0 && g[2] === 0 && g[3] === 1) return { scope: "reserved", label: "Dummy IPv6 prefix (RFC 9780)" };
  if (g[0] === 0x2001 && g[1] === 0xdb8) return { scope: "reserved", label: "Documentation range (RFC 3849)" };
  if (g[0] === 0x3fff && g[1] <= 0x0fff) return { scope: "reserved", label: "Documentation range (RFC 9637)" };
  if ((g[0] & 0xfe00) === 0xfc00) return { scope: "private", label: "Unique local address (RFC 4193)" };
  if ((g[0] & 0xffc0) === 0xfe80) return { scope: "link-local", label: "Link-local (RFC 4291)" };
  if ((g[0] & 0xff00) === 0xff00) return { scope: "reserved", label: "Multicast" };
  return null;
}

function specialRange(input: string): SpecialRange | null | "invalid" {
  const value = unwrapIpv4Mapped(input);
  const version = getIpVersion(value);
  if (!version) return "invalid";
  return version === 4 ? specialIpv4Range(value) : specialIpv6Range(value);
}

export function classifyIpAddress(input: string): IpScope {
  const range = specialRange(input);
  if (range === "invalid") return "invalid";
  return range?.scope ?? "public";
}

/** A short human-readable description of a non-public range, or null for public and invalid input. */
export function describeIpRange(input: string): string | null {
  const range = specialRange(input);
  return range && range !== "invalid" ? range.label : null;
}

export function isPublicIp(input: string): boolean {
  return classifyIpAddress(input) === "public";
}
