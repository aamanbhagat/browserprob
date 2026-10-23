import Link from "next/link";
import { categories, type Tool } from "@/lib/tools";
import styles from "./ToolCard.module.css";

interface ToolCardProps {
  tool: Tool;
  headingLevel?: "h3" | "h4";
}

export default function ToolCard({ tool, headingLevel: Heading = "h3" }: ToolCardProps) {
  return (
    <Link href={`/tools/${tool.slug}`} className={styles.card}>
      <span className={styles.category}>{categories[tool.category].name}</span>
      <Heading className={styles.name}>{tool.name}</Heading>
      <p className={styles.desc}>{tool.description}</p>
      <span className={styles.arrow} aria-hidden="true">→</span>
    </Link>
  );
}
