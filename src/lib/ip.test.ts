import { describe, expect, it } from "vitest";
import { classifyIpAddress, getIpVersion, isValidIpv4, isValidIpv6, normalizeIpAddress } from "./ip";

describe("normalizeIpAddress", () => {
  it.each([
    [" 203.0.113.8 ", "203.0.113.8"], ["for=203.0.113.8", "203.0.113.8"],
    ["for=\"203.0.113.8\"", "203.0.113.8"], ["203.0.113.8:443", "203.0.113.8"],
    ["[2001:DB8::1]:443", "2001:db8::1"], ["fe80::1%en0", "fe80::1"],
    ["::1", "::1"], ["", ""], [null, ""], [undefined, ""],
  ])("normalizes %s", (input, expected) => {
    expect(normalizeIpAddress(input)).toBe(expected);
  });
});

describe("IPv4 validation", () => {
  it.each(["0.0.0.0", "1.1.1.1", "8.8.8.8", "10.0.0.1", "127.0.0.1", "169.254.1.2", "172.16.0.1", "192.168.1.1", "203.0.113.255", "255.255.255.255"])("accepts %s", (value) => {
    expect(isValidIpv4(value)).toBe(true);
    expect(getIpVersion(value)).toBe(4);
  });

  it.each(["1.2.3", "1.2.3.4.5", "256.1.1.1", "-1.2.3.4", "01.2.3.4", "1.2.3.a", "1..3.4", "1.2.3.4/24", "", "hello"])("rejects %s", (value) => {
    expect(isValidIpv4(value)).toBe(false);
  });
});

describe("IPv6 validation", () => {
  it.each(["::", "::1", "2001:4860:4860::8888", "2001:db8::1", "fe80::1", "fc00::1", "fd12:3456::1", "ff02::1", "2001:db8:0:0:0:0:2:1", "::ffff:192.0.2.1"])("accepts %s", (value) => {
    expect(isValidIpv6(value)).toBe(true);
    expect(getIpVersion(value)).toBe(6);
  });

  it.each(["2001:::1", "2001::1::2", "gggg::1", "2001:db8:0:0:0:0:0:0:1", "12345::1", ":", "1:2:3:4:5:6:7", "1:2:3:4:5:6:7:8:9", "::ffff:999.1.1.1", "not-an-ip"])("rejects %s", (value) => {
    expect(isValidIpv6(value)).toBe(false);
  });
});

describe("IP scope classification", () => {
  it.each([
    ["8.8.8.8", "public"], ["1.1.1.1", "public"], ["93.184.216.34", "public"],
    ["10.0.0.1", "private"], ["172.16.0.1", "private"], ["172.31.255.255", "private"], ["192.168.1.1", "private"],
    ["127.0.0.1", "loopback"], ["127.255.255.255", "loopback"], ["169.254.20.1", "link-local"],
    ["100.64.0.1", "reserved"], ["192.0.2.1", "reserved"], ["198.18.0.1", "reserved"],
    ["198.51.100.2", "reserved"], ["203.0.113.2", "reserved"], ["224.0.0.1", "reserved"], ["255.255.255.255", "reserved"],
    ["2001:4860:4860::8888", "public"], ["::1", "loopback"], ["::", "reserved"],
    ["fc00::1", "private"], ["fd00::1", "private"], ["fe80::1", "link-local"],
    ["ff02::1", "reserved"], ["2001:db8::1", "reserved"], ["bad", "invalid"],
  ] as const)("classifies %s as %s", (value, expected) => {
    expect(classifyIpAddress(value)).toBe(expected);
  });
});
