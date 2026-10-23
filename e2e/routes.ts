import { blogPosts } from "../src/data/blog-posts";
import { tools } from "../src/lib/tools";

export const STATIC_ROUTES = ["/", "/tools", "/blog", "/about", "/privacy-policy"];
export const TOOL_ROUTES = tools.map((tool) => `/tools/${tool.slug}`);
export const GUIDE_ROUTES = blogPosts.map((post) => `/blog/${post.slug}`);
export const ALL_ROUTES = [...STATIC_ROUTES, ...TOOL_ROUTES, ...GUIDE_ROUTES];

/** The H1 each route must render in its server HTML. */
export function expectedH1(route: string): string | null {
  const tool = tools.find((item) => `/tools/${item.slug}` === route);
  if (tool) return tool.h1;
  const post = blogPosts.find((item) => `/blog/${item.slug}` === route);
  if (post) return post.title;
  return null;
}
