import { describe, expect, it } from "vitest";
import { classifyPluginList, STANDARD_PDF_PLUGINS } from "./plugins";

describe("classifyPluginList", () => {
  it("recognizes the HTML standard's fixed PDF list in any order", () => {
    expect(classifyPluginList([...STANDARD_PDF_PLUGINS].reverse())).toBe("standard-pdf-list");
  });
  it("recognizes an empty list", () => expect(classifyPluginList([])).toBe("empty"));
  it("flags anything else as non-standard", () => {
    expect(classifyPluginList(["Shockwave Flash"])).toBe("non-standard");
    expect(classifyPluginList([...STANDARD_PDF_PLUGINS, "Native Client"])).toBe("non-standard");
  });
});
