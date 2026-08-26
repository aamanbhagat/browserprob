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

export function classifyIpAddress(input: string): IpScope {
  const value = normalizeIpAddress(input);
  const version = getIpVersion(value);
  if (!version) return "invalid";

  if (version === 4) {
    const [first, second, third] = value.split(".").map(Number);
    if (first === 127) return "loopback";
    if (first === 169 && second === 254) return "link-local";
    if (first === 10 || (first === 172 && second >= 16 && second <= 31) || (first === 192 && second === 168)) return "private";
    if (
      first === 0 ||
      first >= 224 ||
      (first === 100 && second >= 64 && second <= 127) ||
      (first === 192 && second === 0) ||
      (first === 192 && second === 0 && third === 2) ||
      (first === 198 && (second === 18 || second === 19)) ||
      (first === 198 && second === 51 && third === 100) ||
      (first === 203 && second === 0 && third === 113)
    ) return "reserved";
    return "public";
  }

  if (value === "::1") return "loopback";
  if (value === "::") return "reserved";
  if (/^f[cd]/.test(value)) return "private";
  if (/^fe[89ab]/.test(value)) return "link-local";
  if (/^ff/.test(value) || /^2001:db8/.test(value)) return "reserved";
  return "public";
}

export function isPublicIp(input: string): boolean {
  return classifyIpAddress(input) === "public";
}
