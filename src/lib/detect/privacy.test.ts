import { describe, expect, it } from "vitest";
import { parseIceCandidate, summarizeWebRTCAddresses, type WebRTCAddress } from "./privacy";

describe("parseIceCandidate", () => {
  it.each([
    ["candidate:1 1 UDP 2122260223 192.168.1.7 54400 typ host", "192.168.1.7", "host", "UDP", "private"],
    ["candidate:2 1 udp 1686052607 203.0.113.9 62000 typ srflx raddr 0.0.0.0 rport 0", "203.0.113.9", "srflx", "UDP", "reserved"],
    ["candidate:3 1 tcp 1518280447 10.0.0.4 9 typ host tcptype active", "10.0.0.4", "host", "TCP", "private"],
    ["candidate:4 1 UDP 2122260223 fe80::1 54400 typ host", "fe80::1", "host", "UDP", "link-local"],
    ["candidate:5 1 UDP 2122260223 2001:4860:4860::8888 54400 typ srflx", "2001:4860:4860::8888", "srflx", "UDP", "public"],
    ["candidate:6 1 UDP 2122260223 abc123.local 54400 typ host", "abc123.local", "host", "UDP", "mdns"],
  ] as const)("parses an ICE candidate", (candidate, address, candidateType, protocol, scope) => {
    expect(parseIceCandidate(candidate)).toEqual({ address, candidateType, protocol, scope });
  });

  it.each(["", "candidate:1 1 udp", "candidate:1 1 udp 1 not-an-ip 9 typ host"])("rejects malformed candidate %s", (candidate) => {
    expect(parseIceCandidate(candidate)).toBeNull();
  });
});

describe("summarizeWebRTCAddresses", () => {
  const make = (address: string, scope: WebRTCAddress["scope"]): WebRTCAddress => ({ address, scope, candidateType: "host", protocol: "UDP" });

  it("reports unsupported WebRTC", () => expect(summarizeWebRTCAddresses([], false).status).toBe("not-supported"));
  it("reports no candidates", () => expect(summarizeWebRTCAddresses([]).status).toBe("no-addresses"));
  it("recognizes mDNS protection", () => expect(summarizeWebRTCAddresses([make("id.local", "mdns")]).status).toBe("protected"));
  it("reports a numeric local address", () => expect(summarizeWebRTCAddresses([make("192.168.1.2", "private")]).status).toBe("local-address-visible"));
  it("reports a link-local address as local", () => expect(summarizeWebRTCAddresses([make("fe80::1", "link-local")]).privateIPs).toEqual(["fe80::1"]));
  it("reports a public address without claiming a leak", () => {
    const result = summarizeWebRTCAddresses([make("8.8.8.8", "public")]);
    expect(result.status).toBe("public-address-visible");
    expect(result.summary).toContain("Compare");
  });
  it("prioritizes a local-address warning when public and local candidates coexist", () => {
    expect(summarizeWebRTCAddresses([make("8.8.8.8", "public"), make("10.0.0.2", "private")]).status).toBe("local-address-visible");
  });
});
