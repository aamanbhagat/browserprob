import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ADSENSE_CLIENT } from "./ads";

describe("AdSense configuration", () => {
  it("uses the publisher ID from public/ads.txt", () => {
    const adsTxt = readFileSync(new URL("../../public/ads.txt", import.meta.url), "utf8").trim();
    const [, publisher] = adsTxt.split(/,\s*/);
    expect(ADSENSE_CLIENT).toBe(publisher.replace(/^pub-/, "ca-pub-"));
  });
});

describe("ad configuration defaults", () => {
  it("keeps ads off unless the flag is exactly \"true\"", async () => {
    const { ADS_ENABLED } = await import("./ads");
    expect(process.env.NEXT_PUBLIC_ADS_ENABLED).toBeUndefined();
    expect(ADS_ENABLED).toBe(false);
  });

  it("accepts only numeric ad unit IDs", async () => {
    const { parseSlotId } = await import("./ads");
    expect(parseSlotId("1234567890")).toBe("1234567890");
    expect(parseSlotId(" 1234567890 ")).toBe("1234567890");
    expect(parseSlotId(undefined)).toBeNull();
    expect(parseSlotId("")).toBeNull();
    expect(parseSlotId("TODO")).toBeNull();
    expect(parseSlotId("ca-pub-1720101320139769")).toBeNull();
  });
});
