import Link from "next/link";
import type { Tool } from "@/lib/tools";
import styles from "./ToolCard.module.css";

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link href={`/tools/${tool.slug}`} className={styles.card}>
      <span className={styles.icon}>{tool.icon}</span>
      <h3 className={styles.name}>{tool.shortName}</h3>
      <p className={styles.desc}>{tool.description}</p>
      <span className={styles.arrow}>→</span>
    </Link>
  );
}
