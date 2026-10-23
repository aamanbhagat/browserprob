import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getPostBySlug } from "@/data/blog-posts";
import type { Metadata } from "next";
import TableOfContents from "@/components/TableOfContents";
import BlogSidebarWidget from "@/components/BlogSidebarWidget";
import Markdown, { extractHeadings } from "@/components/Markdown";
import styles from "../blog.module.css";

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `https://browserprobe.app/blog/${post.slug}` },
    openGraph: { title: post.title, description: post.excerpt, type: "article", publishedTime: post.date, url: `https://browserprobe.app/blog/${post.slug}` },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Organization", name: "BrowserProbe" },
    publisher: { "@type": "Organization", name: "BrowserProbe" },
  };

  const headings = extractHeadings(post.content);

  return (
    <div className={styles.postPage}>
      <div className="container">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c") }} />
        
        <Link href="/blog" className={styles.backLink}>
          ← Back to Blog
        </Link>
        
        <div className={styles.postHeader}>
          <div className={styles.meta}>
            <span className={`${styles.categoryBadge} ${styles[post.category.toLowerCase()]}`}>
              {post.category}
            </span>
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </time>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
          <h1 className={styles.postTitle}>{post.title}</h1>
        </div>

        <div className={styles.blogLayout}>
          {/* Dynamic Table of Contents */}
          <aside className={styles.leftCol}>
            <TableOfContents items={headings} />
          </aside>

          {/* Core Markdown Content */}
          <article className={styles.centerCol}>
            <div className={styles.postContent}>
              <Markdown content={post.content} />
            </div>
          </article>

          {/* Interactive Privacy Probe Widget */}
          <aside className={styles.rightCol}>
            <BlogSidebarWidget slug={post.slug} />
          </aside>
        </div>
      </div>
    </div>
  );
}
