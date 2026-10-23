import type { IPInfo } from "@/lib/detect/ip";
import type { WebRTCLeak } from "@/lib/detect/privacy";
import { getIpVersion } from "@/lib/ip";

export interface WebRtcComparison {
  level: "ok" | "info" | "review";
  headline: string;
  detail: string;
}

/** Interprets WebRTC ICE results against the address this site saw for the page request. */
export function compareWebRtcWithIp(rtc: WebRTCLeak, ip: Pick<IPInfo, "ip" | "version"> & { scope?: IPInfo["scope"] }): WebRtcComparison {
  if (!rtc.supported) {
    return { level: "ok", headline: "WebRTC is unavailable", detail: "This browser does not expose RTCPeerConnection, so pages cannot gather addresses through WebRTC." };
  }
  if (rtc.status === "error") {
    return { level: "info", headline: "The WebRTC check could not finish", detail: "The browser refused or aborted candidate gathering. Run the test again; if it keeps failing, WebRTC may be disabled by a setting or extension." };
  }
  if (rtc.privateIPs.length > 0) {
    return {
      level: "review",
      headline: "A local network address is visible",
      detail: `WebRTC exposed ${rtc.privateIPs.join(", ")}. That describes your local network rather than your public route. Modern browsers normally hide it behind a random .local name, so a VPN client, extension or browser setting may be changing that behavior.`,
    };
  }
  // A loopback or private page address (local development, or a proxy that hides the client) is not
  // something a public STUN address can meaningfully be compared with.
  const comparable = ip.ip && (!ip.scope || ip.scope === "public") ? ip.ip : null;
  const differing = comparable ? rtc.publicIPs.filter((address) => address !== comparable) : rtc.publicIPs;
  if (rtc.publicIPs.length > 0 && !comparable) {
    return { level: "info", headline: "Public address seen, nothing to compare it with", detail: "WebRTC reported a public address, but this site did not see a public address for your page request, so the two cannot be compared." };
  }
  if (rtc.publicIPs.length > 0 && differing.length === 0) {
    return { level: "ok", headline: "WebRTC shows the same public address this site sees", detail: "No additional address was revealed: the STUN server saw the same address your page request came from." };
  }
  if (differing.length > 0) {
    const sameFamily = differing.some((address) => getIpVersion(address) === ip.version);
    return sameFamily
      ? {
          level: "review",
          headline: "WebRTC revealed a different public address",
          detail: `WebRTC reported ${differing.join(", ")}, but this page was requested from ${ip.ip}. If you use a VPN or proxy, this is the typical sign of a WebRTC leak: check which of the two addresses belongs to your provider.`,
        }
      : {
          level: "info",
          headline: "WebRTC found an address of the other IP family",
          detail: `This page was requested over IPv${ip.version ?? "?"}, and WebRTC also reported ${differing.join(", ")}. Dual-stack connections normally have both an IPv4 and an IPv6 address. It is only a leak if that address belongs to your own ISP while a VPN is supposed to hide it.`,
        };
  }
  if (rtc.mdnsProtected) {
    return { level: "ok", headline: "Local addresses are hidden", detail: "Host candidates used random .local names instead of real addresses, and no public address was gathered through STUN." };
  }
  return {
    level: "ok",
    headline: rtc.timedOut ? "No addresses were gathered in time" : "No addresses were exposed",
    detail: rtc.timedOut
      ? "Candidate gathering did not finish within five seconds. A firewall, VPN or browser policy may be blocking UDP to the STUN server."
      : "Candidate gathering finished without exposing any IP address.",
  };
}
