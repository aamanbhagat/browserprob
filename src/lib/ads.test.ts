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
