import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import ToolCard from "@/components/ToolCard";
import { absoluteUrl } from "@/lib/site";
import { categories, tools, type ToolCategory } from "@/lib/tools";
import styles from "./index.module.css";

export const metadata: Metadata = {
  title: "All Browser Tests",
  description: "Every BrowserProbe test in one list: browser and IP checks, WebRTC and fingerprinting tests, display and hardware details, and web feature support.",
  alternates: { canonical: absoluteUrl("/tools") },
};

const categoryOrder: ToolCategory[] = ["identity", "privacy", "hardware", "features"];

export default function ToolsIndexPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "BrowserProbe tests",
    itemListElement: tools.map((tool, index) => ({ "@type": "ListItem", position: index + 1, name: tool.name, url: absoluteUrl(`/tools/${tool.slug}`) })),
  };

  return (
    <div className={`container ${styles.page}`}>
      <JsonLd data={structuredData} />
      <h1 className={styles.title}>All browser tests</h1>
      <p className={styles.intro}>
        {tools.length} tests, grouped by what they look at. Each one runs in your browser and explains what its result can and
        cannot tell you.
      </p>
      {categoryOrder.map((category) => (
        <section key={category} className={styles.category} aria-labelledby={`cat-${category}`}>
          <h2 id={`cat-${category}`} className={styles.categoryTitle}>{categories[category].name}</h2>
          <div className="tool-grid">
            {tools.filter((tool) => tool.category === category).map((tool) => <ToolCard key={tool.slug} tool={tool} />)}
          </div>
        </section>
      ))}
    </div>
  );
}
