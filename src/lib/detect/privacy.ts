import { classifyIpAddress, normalizeIpAddress } from "@/lib/ip";

export interface PrivacyInfo {
  /** "Enabled", "Disabled", "Not set", or "Not exposed" when the browser has no DNT property at all. */
  doNotTrack: string;
  /** The raw navigator.doNotTrack value ("1", "0", "unspecified", null) or null when not exposed. */
  doNotTrackRaw: string | null;
  /** "Enabled", "Disabled", or "Not supported" when the browser does not expose GPC. */
  globalPrivacyControl: string;
  cookiesEnabled: boolean;
}

interface NavigatorWithGPC extends Navigator {
  globalPrivacyControl?: boolean;
}

export function describeDoNotTrack(raw: string | null | undefined, exposed: boolean): string {
  if (!exposed) return "Not exposed";
  if (raw === "1" || raw === "yes") return "Enabled";
  if (raw === "0" || raw === "no") return "Disabled";
  // Firefox reports "unspecified"; Chromium reports null when the setting is off.
  return "Not set";
}

export function describeGlobalPrivacyControl(value: unknown): string {
  if (value === true) return "Enabled";
  if (value === false) return "Disabled";
  return "Not supported";
}

export function detectPrivacy(): PrivacyInfo {
  const nav = navigator as NavigatorWithGPC;
  const exposed = "doNotTrack" in navigator;
  const raw = exposed ? navigator.doNotTrack : null;

  return {
    doNotTrack: describeDoNotTrack(raw, exposed),
    doNotTrackRaw: raw ?? null,
    globalPrivacyControl: describeGlobalPrivacyControl(nav.globalPrivacyControl),
    cookiesEnabled: navigator.cookieEnabled,
  };
}

export interface WebRTCLeak {
  addresses: WebRTCAddress[];
  publicIPs: string[];
  privateIPs: string[];
  mdnsProtected: boolean;
  supported: boolean;
  status: "not-supported" | "protected" | "public-address-visible" | "local-address-visible" | "no-addresses" | "error";
  summary: string;
  /** True when candidate gathering had not finished before the time limit. */
  timedOut?: boolean;
}

export interface WebRTCAddress {
  address: string;
  candidateType: string;
  protocol: string;
  scope: ReturnType<typeof classifyIpAddress> | "mdns";
}

export function parseIceCandidate(candidate: string): WebRTCAddress | null {
  const parts = candidate.trim().split(/\s+/);
  const address = normalizeIpAddress(parts[4]);
  const typeIndex = parts.indexOf("typ");
  const candidateType = typeIndex >= 0 ? parts[typeIndex + 1] || "unknown" : "unknown";
  const protocol = parts[2]?.toUpperCase() || "unknown";

  if (!address) return null;
  if (address.endsWith(".local")) {
    return { address, candidateType, protocol, scope: "mdns" };
  }

  const scope = classifyIpAddress(address);
  if (scope === "invalid") return null;
  return { address, candidateType, protocol, scope };
}

export function summarizeWebRTCAddresses(addresses: WebRTCAddress[], supported = true): Omit<WebRTCLeak, "addresses"> {
  if (!supported) {
    return {
      supported: false,
      publicIPs: [],
      privateIPs: [],
      mdnsProtected: false,
      status: "not-supported",
      summary: "WebRTC is unavailable in this browser.",
    };
  }

  const publicIPs = addresses.filter((item) => item.scope === "public").map((item) => item.address);
  // Any numeric address that is not globally routable (private, link-local, carrier-grade NAT,
  // other reserved ranges) describes the local network rather than the public route.
  const privateIPs = addresses
    .filter((item) => item.scope === "private" || item.scope === "link-local" || item.scope === "reserved")
    .map((item) => item.address);
  const mdnsProtected = addresses.some((item) => item.scope === "mdns");

  if (privateIPs.length > 0) {
    return {
      supported: true,
      publicIPs,
      privateIPs,
      mdnsProtected,
      status: "local-address-visible",
      summary: "A numeric local-network address is visible to WebRTC peers.",
    };
  }

  if (publicIPs.length > 0) {
    return {
      supported: true,
      publicIPs,
      privateIPs,
      mdnsProtected,
      status: "public-address-visible",
      summary: "WebRTC reports a public network address. Compare it with your detected IP before calling it a VPN leak.",
    };
  }

  if (mdnsProtected) {
    return {
      supported: true,
      publicIPs,
      privateIPs,
      mdnsProtected,
      status: "protected",
      summary: "Local addresses are masked with mDNS hostnames.",
    };
  }

  return {
    supported: true,
    publicIPs,
    privateIPs,
    mdnsProtected,
    status: "no-addresses",
    summary: "No address-bearing ICE candidates were exposed during this check.",
  };
}

export async function detectWebRTCLeak(): Promise<WebRTCLeak> {
  if (typeof RTCPeerConnection === "undefined") {
    return { addresses: [], ...summarizeWebRTCAddresses([], false) };
  }

  return new Promise((resolve) => {
    const addressMap = new Map<string, WebRTCAddress>();
    let settled = false;

    const finish = (pc: RTCPeerConnection, statusOverride?: WebRTCLeak["status"], timedOut = false) => {
      if (settled) return;
      settled = true;
      pc.close();
      const addresses = [...addressMap.values()];
      const summary = summarizeWebRTCAddresses(addresses);
      resolve({
        addresses,
        ...summary,
        timedOut,
        ...(statusOverride === "error" ? { status: "error" as const, summary: "The WebRTC check could not complete." } : {}),
      });
    };

    try {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.cloudflare.com:3478" }],
      });
      pc.createDataChannel("");
      pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .catch(() => finish(pc, "error"));

      const timeout = setTimeout(() => {
        finish(pc, undefined, true);
      }, 5000);

      pc.onicecandidate = (event) => {
        if (!event.candidate) {
          clearTimeout(timeout);
          finish(pc);
          return;
        }

        const parsed = parseIceCandidate(event.candidate.candidate);
        if (parsed) {
          addressMap.set(`${parsed.address}-${parsed.candidateType}-${parsed.protocol}`, parsed);
        }
      };
    } catch {
      resolve({
        addresses: [],
        publicIPs: [],
        privateIPs: [],
        mdnsProtected: false,
        supported: true,
        status: "error",
        summary: "The WebRTC check could not complete.",
      });
    }
  });
}
