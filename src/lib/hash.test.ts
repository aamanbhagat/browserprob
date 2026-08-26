import { describe, expect, it } from "vitest";
import { fingerprintNumbers, fingerprintString } from "./hash";

describe("fingerprintString", () => {
  it.each(["", "a", "BrowserProbe", "BrowserProbe 🌐", "same sample", "0", "null", "line\nbreak", "नमस्ते", "x".repeat(10_000)])("returns a stable 16-character ID", (input) => {
    const result = fingerprintString(input);
    expect(result).toMatch(/^[0-9a-f]{16}$/);
    expect(fingerprintString(input)).toBe(result);
  });

  it("distinguishes nearby strings", () => expect(fingerprintString("sample-a")).not.toBe(fingerprintString("sample-b")));
});

describe("fingerprintNumbers", () => {
  it.each([
    [[0], 6], [[0, 1, -1], 6], [[0.1234567], 6], [[Math.PI, Math.E], 4], [new Float32Array([0.1, 0.2, 0.3]), 6], [[], 6],
  ])("returns a stable ID for a numeric sample", (values, precision) => {
    expect(fingerprintNumbers(values, precision)).toMatch(/^[0-9a-f]{16}$/);
    expect(fingerprintNumbers(values, precision)).toBe(fingerprintNumbers(values, precision));
  });

  it("respects quantization precision", () => {
    expect(fingerprintNumbers([0.1234561], 5)).toBe(fingerprintNumbers([0.1234562], 5));
    expect(fingerprintNumbers([0.1234561], 7)).not.toBe(fingerprintNumbers([0.1234562], 7));
  });
});
