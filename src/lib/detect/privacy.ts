import { classifyIpAddress, normalizeIpAddress } from "@/lib/ip";

export interface PrivacyInfo {
  doNotTrack: string;
  globalPrivacyControl: string;
  cookiesEnabled: boolean;
  thirdPartyCookiesBlocked: string;
  adBlocker: string;
  privateMode: string;
}

interface NavigatorWithGPC extends Navigator {
  globalPrivacyControl?: boolean;
}

export function detectPrivacy(): PrivacyInfo {
  const nav = navigator as NavigatorWithGPC;

  // DNT
  const dnt = navigator.doNotTrack;
  let doNotTrack = "Not set";
  if (dnt === "1") doNotTrack = "Enabled";
  else if (dnt === "0") doNotTrack = "Disabled";

  // GPC
  const gpc = nav.globalPrivacyControl;
  let globalPrivacyControl = "Not supported";
  if (gpc === true) globalPrivacyControl = "Enabled";
  else if (gpc === false) globalPrivacyControl = "Disabled";

  return {
    doNotTrack,
    globalPrivacyControl,
    cookiesEnabled: navigator.cookieEnabled,
    thirdPartyCookiesBlocked: "Check requires iframe test",
    adBlocker: "Detection not implemented",
    privateMode: "Cannot be reliably detected",
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
  const privateIPs = addresses
    .filter((item) => item.scope === "private" || item.scope === "link-local")
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

    const finish = (pc: RTCPeerConnection, statusOverride?: WebRTCLeak["status"]) => {
      if (settled) return;
      settled = true;
      pc.close();
      const addresses = [...addressMap.values()];
      const summary = summarizeWebRTCAddresses(addresses);
      resolve({
        addresses,
        ...summary,
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
        finish(pc);
      }, 3500);

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
