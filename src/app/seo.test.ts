import { describe, expect, it } from "vitest";
import { blogPosts } from "@/data/blog-posts";
import { tools } from "@/lib/tools";
import robots from "./robots";
import sitemap from "./sitemap";

describe("sitemap", () => {
  const urls = sitemap().map((entry) => entry.url);

  it("lists every tool, guide and static page once", () => {
    for (const tool of tools) expect(urls).toContain(`https://browserprobe.app/tools/${tool.slug}`);
    for (const post of blogPosts) expect(urls).toContain(`https://browserprobe.app/blog/${post.slug}`);
    for (const path of ["", "/tools", "/blog", "/about", "/contact", "/privacy-policy", "/terms", "/advertising-and-cookies"]) expect(urls).toContain(`https://browserprobe.app${path}`);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("gives every entry a last-modified date", () => {
    for (const entry of sitemap()) expect(String(entry.lastModified)).toMatch(/^\d{4}-\d{2}-\d{2}/);
  });
});

describe("robots", () => {
  const rules = [robots().rules].flat();
  const forAgent = (agent: string) => rules.find((rule) => [rule.userAgent].flat().includes(agent));

  it("lets Googlebot and the AdSense crawler read every page", () => {
    expect(forAgent("Googlebot")?.allow).toBe("/");
    expect(forAgent("Mediapartners-Google")?.allow).toBe("/");
    expect(forAgent("Mediapartners-Google")?.disallow).toBeUndefined();
  });

  it("keeps generated assets out of the index and points to the sitemap", () => {
    expect(forAgent("Googlebot")?.disallow).toEqual(expect.arrayContaining(["/api/", "/opengraph-image", "/twitter-image", "/favicon.ico"]));
    expect(forAgent("*")?.disallow).toEqual(expect.arrayContaining(["/api/", "/opengraph-image", "/twitter-image", "/favicon.ico"]));
    expect(robots().sitemap).toBe("https://browserprobe.app/sitemap.xml");
  });
});
