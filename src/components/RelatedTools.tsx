import ToolCard from "@/components/ToolCard";
import { getRelatedTools } from "@/lib/tools";
import styles from "./RelatedTools.module.css";

export default function RelatedTools({ currentSlug }: { currentSlug: string }) {
  return (
    <section className={styles.section} aria-labelledby="related-title">
      <h2 id="related-title" className={styles.title}>Related tests</h2>
      <div className={styles.grid}>
        {getRelatedTools(currentSlug, 4).map((tool) => <ToolCard key={tool.slug} tool={tool} />)}
      </div>
    </section>
  );
}
