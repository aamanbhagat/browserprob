import { describe, expect, it } from "vitest";
import { compareReadbacks } from "./canvas";
import { TEST_FONTS } from "./fonts";
import { formatDeviceMemory } from "./hardware";
import { newestCompleteEdition } from "./js-features";
import { summarizeDevices } from "./media";
import { describeDoNotTrack, describeGlobalPrivacyControl } from "./privacy";
import { formatBytes } from "./storage";
import { getTool } from "@/lib/tools";

describe("formatBytes", () => {
  it.each([[null, "Not reported"], [0, "0 B"], [1023, "1023 B"], [1536, "1.5 KB"], [10 * 1024 ** 3, "10 GB"], [-1, "Not reported"]] as const)("formats %s", (input, expected) => {
    expect(formatBytes(input)).toBe(expected);
  });
});

describe("compareReadbacks", () => {
  it("detects stable, varying and blank canvas reads", () => {
    expect(compareReadbacks("a", "a", "blank")).toBe("stable");
    expect(compareReadbacks("a", "b", "blank")).toBe("varies");
    expect(compareReadbacks("blank", "blank", "blank")).toBe("blank");
  });
});

describe("newestCompleteEdition", () => {
  it("stops at the first edition with a missing feature", () => {
    expect(newestCompleteEdition([
      { name: "a", edition: "ES2015", supported: true },
      { name: "b", edition: "ES2020", supported: true },
      { name: "c", edition: "ES2022", supported: false },
      { name: "d", edition: "ES2023", supported: true },
      { name: "e", edition: "ECMA-402 (2022)", supported: false },
    ])).toBe("ES2020");
  });
  it("returns null when ES2015 is incomplete", () => expect(newestCompleteEdition([{ name: "a", edition: "ES2015", supported: false }])).toBeNull());
});

describe("summarizeDevices", () => {
  it("counts kinds and never invents labels", () => {
    const result = summarizeDevices([
      { kind: "audioinput", label: "", deviceId: "" },
      { kind: "videoinput", label: "", deviceId: "abc" },
      { kind: "audiooutput", label: "Speakers", deviceId: "def" },
    ]);
    expect(result.counts).toEqual({ audioinput: 1, audiooutput: 1, videoinput: 1 });
    expect(result.devices.map((d) => d.label)).toEqual(["", "", "Speakers"]);
    expect(result.labelsVisible).toBe(true);
    expect(result.devices[0].hasDeviceId).toBe(false);
  });
});

describe("formatDeviceMemory", () => {
  it.each([[8, "8 GB (rounded)"], [0.5, "512 MB (rounded)"], [undefined, "Not supported in this browser"]] as const)("formats %s", (input, expected) => {
    expect(formatDeviceMemory(input)).toBe(expected);
  });
});

describe("Do Not Track and GPC descriptions", () => {
  it.each([
    ["1", true, "Enabled"], ["0", true, "Disabled"], ["unspecified", true, "Not set"], [null, true, "Not set"], [undefined, false, "Not exposed"],
  ] as const)("describes DNT %s", (raw, exposed, expected) => expect(describeDoNotTrack(raw, exposed)).toBe(expected));
  it.each([[true, "Enabled"], [false, "Disabled"], [undefined, "Not supported"]] as const)("describes GPC %s", (value, expected) => {
    expect(describeGlobalPrivacyControl(value)).toBe(expected);
  });
});

describe("font list", () => {
  it("matches the count promised in the page copy", () => {
    expect(TEST_FONTS).toHaveLength(40);
    expect(new Set(TEST_FONTS).size).toBe(40);
    expect(getTool("font-detection").lead).toContain(`${TEST_FONTS.length} common font names`);
  });
});

describe("feature list", () => {
  it("matches the API count stated on the browser features page", async () => {
    const { readFileSync } = await import("node:fs");
    const source = readFileSync(new URL("./features.ts", import.meta.url), "utf8");
    const count = (source.match(/\{ name: "/g) || []).length;
    const { toolContentBySlug } = await import("@/content/tools");
    expect(toolContentBySlug["browser-features"].sections[0].body).toContain(`${count} web platform APIs`);
  });
});
