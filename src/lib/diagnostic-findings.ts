import type { WebRTCLeak } from "@/lib/detect/privacy";

export type FindingStatus = "pass" | "review" | "limited" | "info";
export type FindingConfidence = "High" | "Medium" | "Limited";

export interface DiagnosticFinding {
  id: string;
  title: string;
  summary: string;
  status: FindingStatus;
  source: string;
  confidence: FindingConfidence;
  href: string;
}

export interface FindingInput {
  globalPrivacyControl: string;
  doNotTrack: string;
  webrtc: WebRTCLeak;
  canvasSupported: boolean;
  audioSupported: boolean;
  detectedFontCount: number;
  mediaLabelsVisible: boolean;
}

export function buildDiagnosticFindings(input: FindingInput): DiagnosticFinding[] {
  const findings: DiagnosticFinding[] = [];

  if (input.globalPrivacyControl === "Enabled") {
    findings.push({
      id: "gpc",
      title: "Global Privacy Control is enabled",
      summary: "Your browser sends an opt-out preference to sites that support GPC.",
      status: "pass",
      source: "Navigator API",
      confidence: "High",
      href: "/tools/do-not-track",
    });
  } else {
    findings.push({
      id: "gpc",
      title: "Global Privacy Control is not active",
      summary: input.globalPrivacyControl === "Not supported"
        ? "This browser does not expose a GPC signal to this page."
        : "Sites that honor GPC will not receive an active opt-out signal.",
      status: input.globalPrivacyControl === "Not supported" ? "limited" : "review",
      source: "Navigator API",
      confidence: "High",
      href: "/tools/do-not-track",
    });
  }

  const webRtcStatus = input.webrtc.status;
  if (webRtcStatus === "local-address-visible") {
    findings.push({
      id: "webrtc",
      title: "WebRTC exposed a local network address",
      summary: "A numeric private or link-local address appeared in an ICE candidate.",
      status: "review",
      source: "WebRTC ICE",
      confidence: "High",
      href: "/tools/webrtc-leak-test",
    });
  } else if (webRtcStatus === "public-address-visible") {
    findings.push({
      id: "webrtc",
      title: "WebRTC reported a public address",
      summary: "This is not automatically a VPN leak. Compare it with the detected public IP.",
      status: "info",
      source: "WebRTC ICE + STUN",
      confidence: "Medium",
      href: "/tools/webrtc-leak-test",
    });
  } else if (webRtcStatus === "protected" || webRtcStatus === "no-addresses") {
    findings.push({
      id: "webrtc",
      title: "No numeric local WebRTC address was exposed",
      summary: input.webrtc.mdnsProtected
        ? "Local candidates were masked with mDNS hostnames."
        : "No address-bearing candidate appeared during this check.",
      status: "pass",
      source: "WebRTC ICE",
      confidence: "Medium",
      href: "/tools/webrtc-leak-test",
    });
  } else {
    findings.push({
      id: "webrtc",
      title: "WebRTC result is limited",
      summary: input.webrtc.summary,
      status: "limited",
      source: "WebRTC ICE",
      confidence: "Limited",
      href: "/tools/webrtc-leak-test",
    });
  }

  if (input.canvasSupported || input.audioSupported) {
    const surfaces = [input.canvasSupported && "canvas", input.audioSupported && "audio"]
      .filter(Boolean)
      .join(" and ");
    findings.push({
      id: "fingerprint",
      title: `${surfaces[0]?.toUpperCase() || "F"}${surfaces.slice(1)} fingerprint surfaces are available`,
      summary: "Availability increases the signals a site can compare, but does not prove that your browser is uniquely identifiable.",
      status: "review",
      source: "Canvas + Audio APIs",
      confidence: "Medium",
      href: "/tools/canvas-fingerprint",
    });
  } else {
    findings.push({
      id: "fingerprint",
      title: "Canvas and audio probes were unavailable",
      summary: "These two common fingerprinting surfaces did not produce a result.",
      status: "pass",
      source: "Canvas + Audio APIs",
      confidence: "Medium",
      href: "/tools/canvas-fingerprint",
    });
  }

  findings.push({
    id: "fonts",
    title: `${input.detectedFontCount} tested fonts were distinguishable`,
    summary: "The test checks a curated list, not every font installed on your device.",
    status: "info",
    source: "Font metric comparison",
    confidence: "Medium",
    href: "/tools/font-detection",
  });

  findings.push({
    id: "media",
    title: input.mediaLabelsVisible ? "Media device labels are visible" : "Media device details are permission-limited",
    summary: input.mediaLabelsVisible
      ? "Previously granted permission may let sites distinguish device names."
      : "Counts and labels can remain incomplete until you explicitly grant permission.",
    status: input.mediaLabelsVisible ? "review" : "pass",
    source: "MediaDevices API",
    confidence: input.mediaLabelsVisible ? "High" : "Limited",
    href: "/tools/media-devices",
  });

  findings.push({
    id: "dnt",
    title: `Do Not Track: ${input.doNotTrack}`,
    summary: "DNT is a preference signal, not a technical block, and many sites ignore it.",
    status: "info",
    source: "Navigator API",
    confidence: "High",
    href: "/tools/do-not-track",
  });

  return findings;
}
