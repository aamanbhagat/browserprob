import { describe, expect, it } from "vitest";
import { blogPosts } from "@/data/blog-posts";
import { toolContentBySlug } from "@/content/tools";
import { contentBlocks } from "@/lib/markdown-text";
import { tools } from "@/lib/tools";

const SUFFIX = " | BrowserProbe";

describe("tool metadata", () => {
  it("has content for every tool and no orphaned content", () => {
    expect(Object.keys(toolContentBySlug).sort()).toEqual(tools.map((tool) => tool.slug).sort());
  });

  it.each(["title", "h1", "metaDescription", "lead", "slug"] as const)("uses a unique %s on every tool page", (field) => {
    const values = tools.map((tool) => tool[field].toLowerCase());
    expect(new Set(values).size).toBe(values.length);
  });

  it.each(tools.map((tool) => [tool.slug, tool] as const))("%s fits search-result limits", (_slug, tool) => {
    expect(`${tool.title}${SUFFIX}`.length).toBeLessThanOrEqual(70);
    expect(tool.metaDescription.length).toBeGreaterThanOrEqual(110);
    expect(tool.metaDescription.length).toBeLessThanOrEqual(170);
    expect(tool.updated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("does not reuse a guide title as a tool title", () => {
    const guideTitles = new Set(blogPosts.map((post) => post.title.toLowerCase()));
    expect(tools.filter((tool) => guideTitles.has(tool.title.toLowerCase()))).toEqual([]);
  });
});

describe("guides", () => {
  it("cite sources, link a real tool and carry valid dates", () => {
    for (const post of blogPosts) {
      expect(post.sources.length, post.slug).toBeGreaterThanOrEqual(3);
      expect(tools.some((tool) => tool.slug === post.relatedTool), post.slug).toBe(true);
      expect(post.updated >= post.date, post.slug).toBe(true);
      for (const source of post.sources) expect(source.url).toMatch(/^https:\/\//);
    }
  });

  it("have unique titles and excerpts", () => {
    expect(new Set(blogPosts.map((post) => post.title)).size).toBe(blogPosts.length);
    expect(new Set(blogPosts.map((post) => post.excerpt)).size).toBe(blogPosts.length);
  });
});

describe("tool and guide copy", () => {
  it("has at least one section and one FAQ entry per tool", () => {
    for (const [slug, content] of Object.entries(toolContentBySlug)) {
      expect(content.sections.length, slug).toBeGreaterThan(0);
      expect(content.faq.length, slug).toBeGreaterThan(0);
      for (const section of content.sections) expect(section.body.trim().length, `${slug}#${section.id}`).toBeGreaterThan(80);
    }
  });

  it("never repeats a substantial paragraph across pages", () => {
    const seen = new Map<string, string>();
    const duplicates: string[] = [];
    const add = (where: string, text: string) => {
      const key = text.toLowerCase().replace(/\s+/g, " ").trim();
      if (key.length < 80) return;
      const first = seen.get(key);
      if (first && first !== where) duplicates.push(`${where} repeats ${first}: "${text.slice(0, 70)}…"`);
      else seen.set(key, where);
    };
    for (const [slug, content] of Object.entries(toolContentBySlug)) {
      for (const section of content.sections) contentBlocks(section.body).forEach((block) => add(`tool:${slug}`, block));
      content.faq.forEach((item) => add(`tool:${slug}:faq`, item.answer));
    }
    for (const post of blogPosts) contentBlocks(post.content).forEach((block) => add(`guide:${post.slug}`, block));
    expect(duplicates).toEqual([]);
  });

  it("asks unique FAQ questions", () => {
    const questions = Object.values(toolContentBySlug).flatMap((content) => content.faq.map((item) => item.question.toLowerCase()));
    expect(new Set(questions).size).toBe(questions.length);
  });

  it("only cites https sources", () => {
    for (const content of Object.values(toolContentBySlug)) {
      for (const source of content.sources) expect(source.url).toMatch(/^https:\/\//);
    }
  });
});
