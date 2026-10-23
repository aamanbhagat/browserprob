import { describe, expect, it } from "vitest";
import { canonicalizeTimezone, compareTimezones, formatUtcOffset, utcOffsetMinutes } from "./timezone";

const offsets: Array<[number, string]> = [
  [720, "UTC-12:00"], [660, "UTC-11:00"], [600, "UTC-10:00"], [570, "UTC-09:30"],
  [540, "UTC-09:00"], [480, "UTC-08:00"], [420, "UTC-07:00"], [360, "UTC-06:00"],
  [300, "UTC-05:00"], [240, "UTC-04:00"], [210, "UTC-03:30"], [180, "UTC-03:00"],
  [120, "UTC-02:00"], [60, "UTC-01:00"], [0, "UTC+00:00"], [-60, "UTC+01:00"],
  [-120, "UTC+02:00"], [-180, "UTC+03:00"], [-210, "UTC+03:30"], [-240, "UTC+04:00"],
  [-270, "UTC+04:30"], [-300, "UTC+05:00"], [-330, "UTC+05:30"], [-345, "UTC+05:45"],
  [-360, "UTC+06:00"], [-390, "UTC+06:30"], [-420, "UTC+07:00"], [-480, "UTC+08:00"],
  [-525, "UTC+08:45"], [-540, "UTC+09:00"], [-570, "UTC+09:30"], [-600, "UTC+10:00"],
  [-630, "UTC+10:30"], [-660, "UTC+11:00"], [-720, "UTC+12:00"], [-765, "UTC+12:45"],
  [-780, "UTC+13:00"], [-840, "UTC+14:00"],
];

describe("formatUtcOffset", () => {
  it.each(offsets)("formats %i as %s", (input, expected) => {
    expect(formatUtcOffset(input)).toBe(expected);
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])("rejects non-finite %s", (input) => {
    expect(formatUtcOffset(input)).toBe("Unknown");
  });
});

describe("canonicalizeTimezone", () => {
  it.each([
    ["Asia/Calcutta", "Asia/Kolkata"], ["Asia/Katmandu", "Asia/Kathmandu"],
    ["Asia/Rangoon", "Asia/Yangon"], ["Asia/Saigon", "Asia/Ho_Chi_Minh"],
    ["Europe/Kiev", "Europe/Kyiv"], ["US/Eastern", "America/New_York"],
    ["US/Central", "America/Chicago"], ["US/Mountain", "America/Denver"],
    ["US/Pacific", "America/Los_Angeles"], ["Europe/London", "Europe/London"],
    ["", "Unknown"],
  ])("canonicalizes %s", (input, expected) => {
    expect(canonicalizeTimezone(input)).toBe(expected);
  });
});

describe("utcOffsetMinutes and compareTimezones", () => {
  const winter = new Date("2026-01-15T12:00:00Z");
  const summer = new Date("2026-07-15T12:00:00Z");

  it.each([
    ["UTC", winter, 0], ["Asia/Kolkata", winter, 330], ["America/New_York", winter, -300], ["America/New_York", summer, -240],
    ["Asia/Kathmandu", summer, 345], ["Not/AZone", winter, null],
  ] as const)("offset of %s", (zone, at, expected) => expect(utcOffsetMinutes(zone, at)).toBe(expected));

  it("matches aliases of the same zone", () => expect(compareTimezones("Asia/Calcutta", "Asia/Kolkata", winter)).toBe("same-zone"));
  it("notices zones that share an offset", () => expect(compareTimezones("Europe/Paris", "Europe/Berlin", winter)).toBe("same-offset"));
  it("flags a different offset", () => expect(compareTimezones("Asia/Kolkata", "America/New_York", winter)).toBe("different"));
  it("returns unknown without an IP zone", () => expect(compareTimezones("Asia/Kolkata", null)).toBe("unknown"));
});
