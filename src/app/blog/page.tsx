import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_CATEGORIES, blogPosts } from "@/data/blog-posts";
import { absoluteUrl, formatDate } from "@/lib/site";
import styles from "./blog.module.css";

export const metadata: Metadata = {
  title: "Guides to Browser Privacy and Diagnostics",
  description: "Plain-language guides to browser fingerprinting, WebRTC leaks, IP addresses, cookies and storage, Client Hints, GPU and screen signals, with sources for every claim.",
  alternates: { canonical: absoluteUrl("/blog") },
};

export default function BlogIndexPage() {
  return (
    <div className={`container ${styles.indexPage}`}>
      <header className={styles.indexHeader}>
        <h1 className={styles.indexTitle}>Guides</h1>
        <p className={styles.indexIntro}>
          Longer explanations of what browsers reveal to websites and what you can do about it. Each guide links to the
          test that shows the values in your own browser, and lists the specifications and documentation it relies on.
        </p>
      </header>

      {BLOG_CATEGORIES.map((category) => {
        const posts = blogPosts.filter((post) => post.category === category);
        if (posts.length === 0) return null;
        const headingId = `cat-${category.toLowerCase().replace(/\W+/g, "-")}`;
        return (
          <section key={category} className={styles.categoryBlock} aria-labelledby={headingId}>
            <h2 id={headingId} className={styles.categoryTitle}>{category}</h2>
            <ul className={styles.postList}>
              {posts.map((post) => (
                <li key={post.slug} className={styles.postItem}>
                  <Link href={`/blog/${post.slug}`} className={styles.postLink}>{post.title}</Link>
                  <p className={styles.postExcerpt}>{post.excerpt}</p>
                  <p className={styles.postMeta}>
                    Updated <time dateTime={post.updated}>{formatDate(post.updated)}</time> · {post.readTime}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
