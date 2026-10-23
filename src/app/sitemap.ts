import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog-posts";
import { absoluteUrl } from "@/lib/site";
import { tools } from "@/lib/tools";

// Dates the content of each static page last changed. Update them when a page's text changes.
export const STATIC_PAGES: { path: string; lastModified: string; priority: number }[] = [
  { path: "/", lastModified: "2026-10-23", priority: 1 },
  { path: "/tools", lastModified: "2026-10-23", priority: 0.8 },
  { path: "/blog", lastModified: "2026-10-23", priority: 0.6 },
  { path: "/about", lastModified: "2026-10-23", priority: 0.5 },
  { path: "/contact", lastModified: "2026-10-23", priority: 0.3 },
  { path: "/privacy-policy", lastModified: "2026-10-23", priority: 0.3 },
  { path: "/terms", lastModified: "2026-10-23", priority: 0.2 },
  { path: "/advertising-and-cookies", lastModified: "2026-10-23", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...STATIC_PAGES.map((page) => ({ url: absoluteUrl(page.path), lastModified: page.lastModified, priority: page.priority })),
    ...tools.map((tool) => ({ url: absoluteUrl(`/tools/${tool.slug}`), lastModified: tool.updated, priority: 0.9 })),
    ...blogPosts.map((post) => ({ url: absoluteUrl(`/blog/${post.slug}`), lastModified: post.updated, priority: 0.7 })),
  ];
}
