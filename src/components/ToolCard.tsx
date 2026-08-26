import Link from "next/link";
import type { Tool } from "@/lib/tools";
import styles from "./ToolCard.module.css";

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
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
        <span className={styles.arrow}>↗</span>
      </div>
      <h3 className={styles.name}>{tool.name}</h3>
      <p className={styles.desc}>{tool.description}</p>
      <span className={styles.openLabel}>Open test</span>
    </Link>
  );
}
