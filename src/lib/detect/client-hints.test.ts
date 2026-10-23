import { describe, expect, it } from "vitest";
import { describePlatformVersion, formatHintValue, isGreaseBrand, readClientHints } from "./client-hints";

describe("Client Hints helpers", () => {
  it.each(["Not)A;Brand", "Not A(Brand", "Not_A Brand", "Not/A)Brand"])("treats %s as GREASE", (brand) => expect(isGreaseBrand(brand)).toBe(true));
  it("keeps real brands", () => expect(isGreaseBrand("Google Chrome")).toBe(false));

  it("formats list and boolean hints", () => {
    expect(formatHintValue("fullVersionList", [{ brand: "Not)A;Brand", version: "8.0.0.0" }, { brand: "Chromium", version: "143.0.7499.40" }])).toBe("Chromium 143.0.7499.40");
    expect(formatHintValue("formFactors", ["Desktop"])).toBe("Desktop");
    expect(formatHintValue("wow64", false)).toBe("No");
    expect(formatHintValue("model", "")).toBe("");
  });

  it("reports browsers without userAgentData as unsupported", async () => {
    expect((await readClientHints(undefined)).supported).toBe(false);
  });

  it("separates returned values from withheld ones", async () => {
    const result = await readClientHints({
      brands: [{ brand: "Chromium", version: "143" }, { brand: "Not)A;Brand", version: "8" }],
      mobile: false,
      platform: "Windows",
      getHighEntropyValues: async () => ({ architecture: "x86", bitness: "64", model: "", platformVersion: "19.0.0", wow64: false, formFactors: ["Desktop"], fullVersionList: [] }),
    });
    expect(result.brands).toEqual([{ brand: "Chromium", version: "143" }]);
    expect(result.highEntropy).toMatchObject({ architecture: "x86", bitness: "64", platformVersion: "19.0.0", wow64: "No" });
    expect(result.withheld).toEqual(expect.arrayContaining(["model", "fullVersionList"]));
  });

  it("records a rejected request without guessing values", async () => {
    const result = await readClientHints({ brands: [], getHighEntropyValues: async () => { throw new DOMException("blocked", "NotAllowedError"); } });
    expect(result.error).toBe("NotAllowedError");
    expect(result.highEntropy).toEqual({});
  });
});

describe("describePlatformVersion", () => {
  it.each([
    ["Windows", "15.0.0", "Windows 11 or later"], ["Windows", "13.0.0", "Windows 11 or later"], ["Windows", "10.0.0", "Windows 10"],
    ["Windows", "0.3.0", "Windows 8.1 or earlier"], ["macOS", "15.2.0", null], ["Windows", undefined, null],
  ] as const)("%s %s", (platform, version, expected) => expect(describePlatformVersion(platform, version)).toBe(expected));
});
