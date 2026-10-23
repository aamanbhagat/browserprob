import { describe, expect, it } from "vitest";
import { contentBlocks, splitAtMiddleHeading, stripInlineMarkdown } from "./markdown-text";

describe("splitAtMiddleHeading", () => {
  const doc = ["Intro", "", "## One", "a", "", "## Two", "b", "", "## Three", "c", "", "## Four", "d"].join("\n");

  it("splits before a heading near the middle and loses nothing", () => {
    const [first, second] = splitAtMiddleHeading(doc);
    expect(second.startsWith("## ")).toBe(true);
    expect(`${first}\n${second}`).toBe(doc);
  });

  it("never splits before the first section", () => expect(splitAtMiddleHeading(doc)[0]).toContain("## One"));
  it("leaves short content whole", () => expect(splitAtMiddleHeading("Intro\n\n## Only\nx")).toEqual(["Intro\n\n## Only\nx", ""]));
});

describe("text helpers", () => {
  it("strips inline Markdown for structured data", () => {
    expect(stripInlineMarkdown("See **bold**, `code` and [a link](/x).")).toBe("See bold, code and a link.");
  });
  it("ignores code fences when listing blocks", () => {
    expect(contentBlocks("Text\n```js\nconst a = 1;\n```\n- item")).toEqual(["Text", "item"]);
  });
});
