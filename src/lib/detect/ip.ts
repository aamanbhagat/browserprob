export interface IPInfo {
  ip: string;
  ipv4: string;
  ipv6: string;
}

export async function detectIP(): Promise<IPInfo> {
  let ipv4 = "Not detected";
  let ipv6 = "Not detected";
  let ip = "Unable to detect";

  // Try to get public IPv4 via ipify
  try {
    const res = await fetch("https://api.ipify.org?format=json", {
      signal: AbortSignal.timeout(3000),
    });
    const data = await res.json();
    if (data.ip) {
      ipv4 = data.ip;
    }
  } catch (e) {
    console.error("IPv4 public detection failed:", e);
  }

  // Try to get public IPv6 (or fallback to IPv4) via api64.ipify
  try {
    const res = await fetch("https://api64.ipify.org?format=json", {
      signal: AbortSignal.timeout(3000),
    });
    const data = await res.json();
    if (data.ip) {
      if (data.ip.includes(":")) {
        ipv6 = data.ip;
      } else {
        if (ipv4 === "Not detected") {
          ipv4 = data.ip;
        }
      }
    }
  } catch (e) {
    console.error("IPv6 public detection failed:", e);
  }

  // Fallback to local server API if public APIs are blocked or fail
  try {
    const res = await fetch("/api/ip", {
      signal: AbortSignal.timeout(3000),
    });
    const data = await res.json();
    if (data.ip && data.ip !== "Unable to detect" && data.ip !== "::1" && data.ip !== "127.0.0.1") {
      if (data.ip.includes(":")) {
        if (ipv6 === "Not detected") ipv6 = data.ip;
      } else {
        if (ipv4 === "Not detected") ipv4 = data.ip;
      }
    }
    // Read direct server-side ipv4 and ipv6 results
    if (data.ipv4 && data.ipv4 !== "Not detected" && ipv4 === "Not detected") {
      ipv4 = data.ipv4;
    }
    if (data.ipv6 && data.ipv6 !== "Not detected" && ipv6 === "Not detected") {
      ipv6 = data.ipv6;
    }
  } catch (e) {
    console.error("Local IP route fetch failed:", e);
  }

  // Determine the primary IP to display
  if (ipv6 !== "Not detected") {
    ip = ipv6;
  } else if (ipv4 !== "Not detected") {
    ip = ipv4;
  } else {
    // If all else fails, use whatever the local API returned
    try {
      const res = await fetch("/api/ip");
      const data = await res.json();
      if (data.ip) {
        ip = data.ip;
      }
    } catch {
      // ignore
    }
  }

  return { ip, ipv4, ipv6 };
}
