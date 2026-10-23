import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/components/ads/AdSlot";
import JsonLd from "@/components/JsonLd";
import Markdown, { extractHeadings } from "@/components/Markdown";
import TableOfContents from "@/components/TableOfContents";
import { blogPosts, getPostBySlug } from "@/data/blog-posts";
import { AD_SLOTS } from "@/lib/ads";
import { splitAtMiddleHeading } from "@/lib/markdown-text";
import { absoluteUrl, formatDate, SITE_NAME } from "@/lib/site";
import { getTool } from "@/lib/tools";
import styles from "../blog.module.css";

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const url = absoluteUrl(`/blog/${post.slug}`);
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: { type: "article", url, title: post.title, description: post.excerpt, publishedTime: post.date, modifiedTime: post.updated, siteName: SITE_NAME },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const url = absoluteUrl(`/blog/${post.slug}`);
  const tool = getTool(post.relatedTool);
  const headings = extractHeadings(post.content);
  const [firstHalf, secondHalf] = splitAtMiddleHeading(post.content);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: post.title,
        description: post.excerpt,
        datePublished: post.date,
        dateModified: post.updated,
        mainEntityOfPage: url,
        author: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/about") },
        publisher: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
        citation: post.sources.map((source) => source.url),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Guides", item: absoluteUrl("/blog") },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  };

  return (
    <article className={`container ${styles.postPage}`}>
      <JsonLd data={structuredData} />
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <ol>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/blog">Guides</Link></li>
          <li aria-current="page">{post.category}</li>
        </ol>
      </nav>

      <header className={styles.postHeader}>
        <p className={styles.postCategory}>{post.category}</p>
        <h1 className={styles.postTitle}>{post.title}</h1>
        <p className={styles.postLead}>{post.excerpt}</p>
        <p className={styles.postMeta}>
          Published <time dateTime={post.date}>{formatDate(post.date)}</time>
          {post.updated !== post.date && <> · Updated <time dateTime={post.updated}>{formatDate(post.updated)}</time></>}
          {" "}· {post.readTime} · By the BrowserProbe project
        </p>
      </header>

      <div className={styles.postLayout}>
        <aside className={styles.toc}>
          <TableOfContents items={headings} />
        </aside>

        <div className={styles.postBody}>
          <Markdown content={firstHalf} />
          <AdSlot slot={AD_SLOTS.guideMiddle} />
          {secondHalf && <Markdown content={secondHalf} />}

          <section className={styles.sources} aria-labelledby="sources-title">
            <h2 id="sources-title">Sources</h2>
            <ol>
              {post.sources.map((source) => (
                <li key={source.url}><a href={source.url} rel="noopener noreferrer">{source.title}</a></li>
              ))}
            </ol>
          </section>

          <AdSlot slot={AD_SLOTS.guideEnd} />
        </div>

        <aside className={styles.sidebar} aria-label="Related test">
          <div className={styles.toolCard}>
            <p className={styles.toolCardLabel}>Try it in your browser</p>
            <p className={styles.toolCardName}>{tool.name}</p>
            <p className={styles.toolCardText}>{tool.description}</p>
            <Link className={styles.toolCardLink} href={`/tools/${tool.slug}`}>Open the test</Link>
          </div>
        </aside>
      </div>
    </article>
  );
}
