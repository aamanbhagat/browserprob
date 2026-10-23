import { describe, expect, it } from "vitest";
import type { WebRTCLeak } from "./detect/privacy";
import { compareWebRtcWithIp } from "./webrtc-compare";

const rtc = (overrides: Partial<WebRTCLeak> = {}): WebRTCLeak => ({
  addresses: [], publicIPs: [], privateIPs: [], mdnsProtected: false, supported: true, status: "no-addresses", summary: "", ...overrides,
});

describe("compareWebRtcWithIp", () => {
  it("treats unsupported WebRTC as nothing to leak", () => {
    expect(compareWebRtcWithIp(rtc({ supported: false, status: "not-supported" }), { ip: "8.8.8.8", version: 4 }).level).toBe("ok");
  });

  it("flags a numeric local address for review", () => {
    const result = compareWebRtcWithIp(rtc({ privateIPs: ["192.168.1.4"], status: "local-address-visible" }), { ip: "8.8.8.8", version: 4 });
    expect(result.level).toBe("review");
    expect(result.detail).toContain("192.168.1.4");
  });

  it("is reassuring when the STUN address equals the page's address", () => {
    const result = compareWebRtcWithIp(rtc({ publicIPs: ["8.8.8.8"], status: "public-address-visible" }), { ip: "8.8.8.8", version: 4 });
    expect(result).toMatchObject({ level: "ok", headline: "WebRTC shows the same public address this site sees" });
  });

  it("calls a different same-family public address the typical leak sign", () => {
    const result = compareWebRtcWithIp(rtc({ publicIPs: ["203.0.113.50"], status: "public-address-visible" }), { ip: "198.51.100.7", version: 4 });
    expect(result.level).toBe("review");
    expect(result.headline).toBe("WebRTC revealed a different public address");
  });

  it("does not call an other-family address a leak on its own", () => {
    const result = compareWebRtcWithIp(rtc({ publicIPs: ["2001:4860:4860::8888"], status: "public-address-visible" }), { ip: "8.8.8.8", version: 4 });
    expect(result.level).toBe("info");
    expect(result.detail).toContain("Dual-stack");
  });

  it("does not compare against a loopback or private page address", () => {
    const result = compareWebRtcWithIp(rtc({ publicIPs: ["203.0.113.50"], status: "public-address-visible" }), { ip: "::1", version: 6, scope: "loopback" });
    expect(result.headline).toBe("Public address seen, nothing to compare it with");
  });

  it("cannot compare without the page's address", () => {
    expect(compareWebRtcWithIp(rtc({ publicIPs: ["8.8.8.8"] }), { ip: null, version: null }).headline).toBe("Public address seen, nothing to compare it with");
  });

  it("recognizes mDNS-only results and timeouts", () => {
    expect(compareWebRtcWithIp(rtc({ mdnsProtected: true, status: "protected" }), { ip: "8.8.8.8", version: 4 }).headline).toBe("Local addresses are hidden");
    expect(compareWebRtcWithIp(rtc({ timedOut: true }), { ip: "8.8.8.8", version: 4 }).headline).toBe("No addresses were gathered in time");
  });
});
