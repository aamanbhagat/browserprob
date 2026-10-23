import Link from "next/link";
import type { Tool } from "@/lib/tools";
import styles from "./ToolCard.module.css";

interface ToolCardProps {
  tool: Tool;
  headingLevel?: "h3" | "h4";
}

export default function ToolCard({ tool, headingLevel: Heading = "h3" }: ToolCardProps) {
  const code = tool.shortName
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

  return (
    <Link href={`/tools/${tool.slug}`} className={styles.card}>
      <div className={styles.topline}>
        <span className={styles.icon} aria-hidden="true">{code}</span>
        <span className={styles.arrow} aria-hidden="true">↗</span>
      </div>
      <Heading className={styles.name}>{tool.name}</Heading>
      <p className={styles.desc}>{tool.description}</p>
      <span className={styles.openLabel}>Open test</span>
    </Link>
  );
}
