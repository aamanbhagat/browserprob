import { NextRequest, NextResponse } from "next/server";
import { classifyIpAddress, getIpVersion, normalizeIpAddress } from "@/lib/ip";

function firstValidAddress(value: string | null): string {
  if (!value) return "";
  for (const candidate of value.split(",")) {
    const address = normalizeIpAddress(candidate);
    if (getIpVersion(address)) return address;
  }
  return "";
}

export async function GET(request: NextRequest) {
  const platformAddress = firstValidAddress(request.headers.get("x-vercel-forwarded-for"));
  const forwardedAddress = firstValidAddress(request.headers.get("x-forwarded-for"));
  const realAddress = firstValidAddress(request.headers.get("x-real-ip"));
  let ip = platformAddress || forwardedAddress || realAddress || "::1";

  let ipv4 = "Not detected";
  let ipv6 = "Not detected";

  const scope = classifyIpAddress(ip);
  const isLocal = scope !== "public" || process.env.NODE_ENV === "development";

  if (isLocal) {
    // In local development, client is loopback. We fetch public IP APIs from the server
    // (which operates from the same machine/router but bypasses client browser adblockers).
    try {
      const res = await fetch("https://api4.ipify.org?format=json", {
        cache: "no-store",
        signal: AbortSignal.timeout(2000),
      });
      const data = await res.json();
      const address = normalizeIpAddress(data.ip);
      if (getIpVersion(address) === 4) {
        ipv4 = address;
      }
    } catch {
      // ignore
    }

    try {
      const res = await fetch("https://api6.ipify.org?format=json", {
        cache: "no-store",
        signal: AbortSignal.timeout(2000),
      });
      const data = await res.json();
      const address = normalizeIpAddress(data.ip);
      if (getIpVersion(address) === 6) {
        ipv6 = address;
      }
    } catch {
      // ignore
    }

    if (ipv6 !== "Not detected") {
      ip = ipv6;
    } else if (ipv4 !== "Not detected") {
      ip = ipv4;
    }
  } else {
    // In production, the client's public IP is retrieved via headers
    if (getIpVersion(ip) === 6) {
      ipv6 = ip;
    } else {
      ipv4 = ip;
    }
  }

  return NextResponse.json(
    { ip, ipv4, ipv6, source: "server" },
    {
      headers: {
        "Cache-Control": "private, no-store, max-age=0",
        "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
      },
    },
  );
}
