import { NextRequest, NextResponse } from "next/server";
import { resolveClientIp } from "@/lib/client-ip";

// Reports the address this request arrived from, as seen in the hosting platform's request headers.
// Nothing is stored and no other service is contacted. A single request can only reveal the one
// address family (IPv4 or IPv6) that the browser used for it.
export function GET(request: NextRequest) {
  return NextResponse.json(resolveClientIp(request.headers), {
    headers: {
      "Cache-Control": "private, no-store, max-age=0",
      "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
    },
  });
}
