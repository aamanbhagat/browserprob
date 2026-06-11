import Link from "next/link";
import { blogPosts } from "@/data/blog-posts";
import type { Metadata } from "next";
import styles from "./blog.module.css";

export const metadata: Metadata = {
  title: "Browser Privacy & Security Blog | BrowserProbe",
  description: "Deep dives into browser fingerprinting, WebRTC leaks, canvas tracking, privacy headers, and hardware exposure. Read expert security analyses and guides.",
  alternates: { canonical: "https://browserprobe.app/blog" },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeCategory = category?.trim() || "";

  const filteredPosts = activeCategory
    ? blogPosts.filter(
        (post) => post.category.toLowerCase() === activeCategory.toLowerCase()
      )
    : blogPosts;

  const categories = ["All", "Tracking", "Security", "Privacy", "Identity"];

  return (
    <div className={styles.blogPage}>
      <div className="container">
        <div className={styles.header}>
          <div className={styles.eyebrow}>Diagnostics & Research</div>
          <h1 className={styles.title}>The Privacy Lab</h1>
          <p className={styles.subtitle}>
            In-depth technical papers, browser fingerprinting breakdowns, and privacy mitigation guides.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className={styles.filterBar}>
          {categories.map((cat) => {
            const isAll = cat === "All";
            const isActive = isAll ? !activeCategory : activeCategory.toLowerCase() === cat.toLowerCase();
            const href = isAll ? "/blog" : `/blog?category=${cat.toLowerCase()}`;

            return (
              <Link
                key={cat}
                href={href}
                className={`${styles.filterPill} ${isActive ? styles.activePill : ""}`}
              >
                {cat}
                {isAll ? (
                  <span className={styles.pillCount}>{blogPosts.length}</span>
                ) : (
                  <span className={styles.pillCount}>
                    {blogPosts.filter((p) => p.category === cat).length}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Blog Post Cards Grid */}
        {filteredPosts.length > 0 ? (
          <div className={styles.grid}>
            {filteredPosts.map((post) => (
              <article key={post.slug} className={styles.card}>
                <Link href={`/blog/${post.slug}`} className={styles.cardLink}>
                  <div className={styles.cardMeta}>
                    <span className={`${styles.categoryBadge} ${styles[post.category.toLowerCase()]}`}>
                      {post.category}
                    </span>
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className={styles.cardTitle}>{post.title}</h2>
                  <p className={styles.excerpt}>{post.excerpt}</p>
                  <div className={styles.cardFooter}>
                    <span className={styles.readMore}>Read technical paper</span>
                    <span className={styles.arrow}>→</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>No articles found in this category.</p>
            <Link href="/blog" className={styles.resetBtn}>
              Show all papers
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
