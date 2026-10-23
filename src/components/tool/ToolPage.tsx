import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import JsonLd from "@/components/JsonLd";
import Markdown, { renderInline, stripInlineMarkdown } from "@/components/Markdown";
import RelatedTools from "@/components/RelatedTools";
import { getToolContent } from "@/content/tools";
import { absoluteUrl, formatDate, SITE_NAME } from "@/lib/site";
import { categories, getTool } from "@/lib/tools";
import styles from "./ToolPage.module.css";

export function toolMetadata(slug: string): Metadata {
  const tool = getTool(slug);
  const url = absoluteUrl(`/tools/${slug}`);
  return {
    title: tool.title,
    description: tool.metaDescription,
    alternates: { canonical: url },
    openGraph: { type: "website", url, title: `${tool.title} | ${SITE_NAME}`, description: tool.metaDescription, siteName: SITE_NAME },
    twitter: { card: "summary_large_image", title: `${tool.title} | ${SITE_NAME}`, description: tool.metaDescription },
  };
}

export default function ToolPage({ slug, children, noscriptMessage }: { slug: string; children: ReactNode; noscriptMessage?: string }) {
  const tool = getTool(slug);
  const content = getToolContent(slug);
  const url = absoluteUrl(`/tools/${slug}`);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${url}#app`,
        name: tool.name,
        url,
        description: tool.metaDescription,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript",
        isAccessibleForFree: true,
        dateModified: tool.updated,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Tools", item: absoluteUrl("/tools") },
          { "@type": "ListItem", position: 3, name: tool.name, item: url },
        ],
      },
      ...(content.faq.length
        ? [{
            "@type": "FAQPage",
            "@id": `${url}#faq`,
            mainEntity: content.faq.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: stripInlineMarkdown(item.answer) },
            })),
          }]
        : []),
    ],
  };

  return (
    <article className={styles.page}>
      <JsonLd data={structuredData} />
      <div className={`container ${styles.inner}`}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <ol>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/tools">Tools</Link></li>
            <li aria-current="page">{tool.name}</li>
          </ol>
        </nav>

        <header className={styles.header}>
          <p className={styles.eyebrow}>{categories[tool.category].name}</p>
          <h1 className={styles.title}>{tool.h1}</h1>
          <p className={styles.lead}>{tool.lead}</p>
        </header>

        <section className={styles.results} aria-label="Your results">
          <noscript>
            <p className={styles.noscript}>
              {noscriptMessage ??
                "This test runs inside your browser and needs JavaScript to read the values. JavaScript appears to be turned off, so no result can be shown. The explanation below still describes what the test measures."}
            </p>
          </noscript>
          {children}
        </section>

        <div className={styles.body}>
          {content.sections.map((section) => (
            <section key={section.id} id={section.id} className={styles.section} aria-labelledby={`${section.id}-title`}>
              <h2 id={`${section.id}-title`} className={styles.sectionTitle}>{section.heading}</h2>
              <Markdown content={section.body} />
            </section>
          ))}

          {content.faq.length > 0 && (
            <section id="faq" className={styles.section} aria-labelledby="faq-title">
              <h2 id="faq-title" className={styles.sectionTitle}>Frequently asked questions</h2>
              <div className={styles.faq}>
                {content.faq.map((item) => (
                  <div key={item.question} className={styles.faqItem}>
                    <h3 className={styles.faqQuestion}>{item.question}</h3>
                    <p className={styles.faqAnswer}>{renderInline(item.answer)}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {content.sources.length > 0 && (
            <section id="sources" className={styles.section} aria-labelledby="sources-title">
              <h2 id="sources-title" className={styles.sectionTitle}>Sources</h2>
              <ul className={styles.sources}>
                {content.sources.map((source) => (
                  <li key={source.url}><a href={source.url} rel="noopener noreferrer">{source.title}</a></li>
                ))}
              </ul>
            </section>
          )}

          <p className={styles.reviewed}>
            Method and text last reviewed <time dateTime={tool.updated}>{formatDate(tool.updated)}</time>.{" "}
            <Link href="/about#method">How BrowserProbe tests</Link>
          </p>
        </div>

        <RelatedTools currentSlug={slug} />
      </div>
    </article>
  );
}
