import Link from "next/link";
import { getRelatedTools } from "@/lib/tools";
import styles from "./RelatedTools.module.css";

interface RelatedToolsProps {
  currentSlug: string;
}

export default function RelatedTools({ currentSlug }: RelatedToolsProps) {
  const related = getRelatedTools(currentSlug, 4);

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Related Tools</h2>
      <div className={styles.grid}>
        {related.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className={styles.card}
          >
            <span className={styles.icon}>{tool.icon}</span>
            <span className={styles.name}>{tool.name}</span>
            <span className={styles.arrow}>→</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
