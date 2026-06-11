import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getPostBySlug } from "@/data/blog-posts";
import type { Metadata } from "next";
import React from "react";
import TableOfContents from "@/components/TableOfContents";
import BlogSidebarWidget from "@/components/BlogSidebarWidget";
import CodeBlock from "@/components/CodeBlock";
import styles from "../blog.module.css";

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} | BrowserProbe Blog`,
    description: post.excerpt,
    alternates: { canonical: `https://browserprobe.app/blog/${post.slug}` },
    openGraph: { title: post.title, description: post.excerpt, type: "article", publishedTime: post.date },
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

  const getHeadingId = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const extractToC = (content: string) => {
    const lines = content.split("\n");
    const headings: { text: string; id: string; level: number }[] = [];
    
    lines.forEach((line) => {
      if (line.startsWith("## ")) {
        const text = line.substring(3).trim();
        headings.push({
          text,
          id: getHeadingId(text),
          level: 2,
        });
      } else if (line.startsWith("### ")) {
        const text = line.substring(4).trim();
        headings.push({
          text,
          id: getHeadingId(text),
          level: 3,
        });
      }
    });
    return headings;
  };

  const parseInlineContent = (text: string): React.ReactNode[] => {
    // Matches: **bold**, `code`, [text](url)
    const tokenRegex = /(\*\*([^*]+)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\))/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = tokenRegex.exec(text)) !== null) {
      const matchIndex = match.index;
      if (matchIndex > lastIndex) {
        parts.push(text.substring(lastIndex, matchIndex));
      }

      const [, , boldText, codeText, linkText, linkUrl] = match;

      if (boldText !== undefined) {
        parts.push(<strong key={matchIndex}>{boldText}</strong>);
      } else if (codeText !== undefined) {
        parts.push(<code key={matchIndex} className={styles.inlineCode}>{codeText}</code>);
      } else if (linkText !== undefined && linkUrl !== undefined) {
        if (linkUrl.startsWith("/")) {
          parts.push(
            <Link key={matchIndex} href={linkUrl} className={styles.inlineLink}>
              {linkText}
            </Link>
          );
        } else {
          parts.push(
            <a key={matchIndex} href={linkUrl} target="_blank" rel="noopener noreferrer" className={styles.inlineLink}>
              {linkText}
            </a>
          );
        }
      }

      lastIndex = tokenRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : [text];
  };

  const renderMarkdownToHTML = (content: string) => {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      
      // 1. Code Blocks
      if (line.trim().startsWith("```")) {
        const lang = line.trim().substring(3).trim();
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith("```")) {
          codeLines.push(lines[i]);
          i++;
        }
        i++; // skip closing tag
        
        const codeText = codeLines.join("\n");
        elements.push(
          <CodeBlock key={`code-${i}`} code={codeText} language={lang} />
        );
        continue;
      }
      
      // 2. Blockquotes
      if (line.startsWith("> ")) {
        const quoteLines: string[] = [];
        while (i < lines.length && lines[i].startsWith("> ")) {
          quoteLines.push(lines[i].substring(2));
          i++;
        }
        
        elements.push(
          <blockquote key={`quote-${i}`} className={styles.blockquote}>
            {quoteLines.map((ql, qIdx) => (
              <p key={qIdx}>{parseInlineContent(ql)}</p>
            ))}
          </blockquote>
        );
        continue;
      }

      // 3. Unordered Lists
      if (line.startsWith("- ")) {
        const listItems: string[] = [];
        while (i < lines.length && lines[i].startsWith("- ")) {
          listItems.push(lines[i].substring(2));
          i++;
        }
        
        elements.push(
          <ul key={`ul-${i}`} className={styles.ul}>
            {listItems.map((item, lIdx) => (
              <li key={lIdx}>{parseInlineContent(item)}</li>
            ))}
          </ul>
        );
        continue;
      }

      // 4. Ordered Lists
      const isOrderedMatch = line.match(/^(\d+)\.\s(.*)/);
      if (isOrderedMatch) {
        const listItems: string[] = [];
        while (i < lines.length && lines[i].match(/^(\d+)\.\s(.*)/)) {
          const itemMatch = lines[i].match(/^(\d+)\.\s(.*)/);
          if (itemMatch) {
            listItems.push(itemMatch[2]);
          }
          i++;
        }
        
        elements.push(
          <ol key={`ol-${i}`} className={styles.ol}>
            {listItems.map((item, lIdx) => (
              <li key={lIdx}>{parseInlineContent(item)}</li>
            ))}
          </ol>
        );
        continue;
      }

      // 5. Headings
      if (line.startsWith("### ")) {
        const headingText = line.substring(4).trim();
        elements.push(
          <h3 key={`h3-${i}`} id={getHeadingId(headingText)} className={styles.h3}>
            {headingText}
          </h3>
        );
        i++;
        continue;
      }

      if (line.startsWith("## ")) {
        const headingText = line.substring(3).trim();
        elements.push(
          <h2 key={`h2-${i}`} id={getHeadingId(headingText)} className={styles.h2}>
            {headingText}
          </h2>
        );
        i++;
        continue;
      }

      // 6. Blank Line
      if (line.trim() === "") {
        i++;
        continue;
      }

      // 7. Paragraph
      elements.push(
        <p key={`p-${i}`} className={styles.paragraph}>
          {parseInlineContent(line)}
        </p>
      );
      i++;
    }
    
    return elements;
  };

  const headings = extractToC(post.content);

  return (
    <div className={styles.postPage}>
      <div className="container">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
        
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
              {renderMarkdownToHTML(post.content)}
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
