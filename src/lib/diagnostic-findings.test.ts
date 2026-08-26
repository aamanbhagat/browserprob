import { describe, expect, it } from "vitest";
import { buildDiagnosticFindings, type FindingInput } from "./diagnostic-findings";

function input(overrides: Partial<FindingInput> = {}): FindingInput {
  return {
    globalPrivacyControl: "Enabled",
    doNotTrack: "Enabled",
    webrtc: {
      addresses: [], publicIPs: [], privateIPs: [], mdnsProtected: true, supported: true,
      status: "protected", summary: "Local addresses are masked with mDNS hostnames.",
    },
    canvasSupported: true,
    audioSupported: true,
    detectedFontCount: 12,
    mediaLabelsVisible: false,
    ...overrides,
  };
}

describe("buildDiagnosticFindings", () => {
  it("always returns the six documented findings", () => expect(buildDiagnosticFindings(input())).toHaveLength(6));
  it("marks active GPC as a pass", () => expect(buildDiagnosticFindings(input()).find((item) => item.id === "gpc")?.status).toBe("pass"));
  it("marks unsupported GPC as limited", () => expect(buildDiagnosticFindings(input({ globalPrivacyControl: "Not supported" })).find((item) => item.id === "gpc")?.status).toBe("limited"));
  it("marks inactive GPC for review", () => expect(buildDiagnosticFindings(input({ globalPrivacyControl: "Disabled" })).find((item) => item.id === "gpc")?.status).toBe("review"));
  it("marks a local WebRTC address for review", () => expect(buildDiagnosticFindings(input({ webrtc: { ...input().webrtc, status: "local-address-visible" } })).find((item) => item.id === "webrtc")?.status).toBe("review"));
  it("does not label a public WebRTC address as a leak", () => {
    const finding = buildDiagnosticFindings(input({ webrtc: { ...input().webrtc, status: "public-address-visible" } })).find((item) => item.id === "webrtc");
    expect(finding?.status).toBe("info");
    expect(finding?.summary).toContain("not automatically a VPN leak");
  });
  it("marks unavailable WebRTC as limited", () => expect(buildDiagnosticFindings(input({ webrtc: { ...input().webrtc, status: "not-supported" } })).find((item) => item.id === "webrtc")?.status).toBe("limited"));
  it("passes when canvas and audio probes are unavailable", () => expect(buildDiagnosticFindings(input({ canvasSupported: false, audioSupported: false })).find((item) => item.id === "fingerprint")?.status).toBe("pass"));
  it.each([[true, false, "Canvas"], [false, true, "Audio"], [true, true, "Canvas and audio"]] as const)("labels available fingerprint surfaces", (canvasSupported, audioSupported, title) => {
    expect(buildDiagnosticFindings(input({ canvasSupported, audioSupported })).find((item) => item.id === "fingerprint")?.title).toContain(title);
  });
  it("marks visible media labels for review", () => expect(buildDiagnosticFindings(input({ mediaLabelsVisible: true })).find((item) => item.id === "media")?.status).toBe("review"));
  it("reports the tested font count without a uniqueness score", () => {
    const finding = buildDiagnosticFindings(input({ detectedFontCount: 31 })).find((item) => item.id === "fonts");
    expect(finding?.title).toContain("31");
    expect(finding?.summary).not.toContain("unique");
  });
});
