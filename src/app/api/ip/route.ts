import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let ip = forwarded?.split(",")[0]?.trim() || realIp || (request as any).ip || "::1";

  let ipv4 = "Not detected";
  let ipv6 = "Not detected";

  const isLocal =
    ip === "::1" ||
    ip === "127.0.0.1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.16.") ||
    process.env.NODE_ENV === "development";

  if (isLocal) {
    // In local development, client is loopback. We fetch public IP APIs from the server
    // (which operates from the same machine/router but bypasses client browser adblockers).
    try {
      const res = await fetch("https://api4.ipify.org?format=json", {
        signal: AbortSignal.timeout(2000),
      });
      const data = await res.json();
      if (data.ip) {
        ipv4 = data.ip;
      }
    } catch {
      // ignore
    }

    try {
      const res = await fetch("https://api6.ipify.org?format=json", {
        signal: AbortSignal.timeout(2000),
      });
      const data = await res.json();
      if (data.ip) {
        ipv6 = data.ip;
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
    if (ip.includes(":")) {
      ipv6 = ip;
    } else {
      ipv4 = ip;
    }
  }

  return NextResponse.json({ ip, ipv4, ipv6 });
}
